import '../../index.css';
import '../../css/GameMain.css';
import "../../css/MultiGame.css";
import '../../css/Timer.css';
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
import MultiResultModal from "./MultiResultModal.jsx";
import newSocket from "../game/server.js"
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import multiStore from '../../stores/multiStore.jsx';
import store from "../../store/store.js";
import axios from 'axios';

import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

import FillInTheBlank from "../game/FillInTheBlank";
import ShortAnswer from "../game/short_answer/ShortAnswer";
import MultipleChoice from "../game/MultipleChoice";

// const baseUrl = "https://www.ssafy11s.com"; // ssafy11s.com으로 수정하기
const baseUrl = "http://localhost:8080"


export default function MultiGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatStompClient = useRef(null);

  const {
    memberId,
    userId,
    name,
    baseURL,
    wsChat,
  } = store((state) => ({
    memberId: state.memberId,
    userId: state.userId,
    name: state.name,
    baseURL: state.baseURL,
    wsChat: state.wsChat,
  }));


  const roomId = multiStore.getState().roomId;
  const username = multiStore.getState().username;

  const [socket, setSocket] = useState(null);
  const [start, setStart] = useState(0);
  const [hostId, setHostId] = useState(null);
  const [user, setUser] = useState(username);

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatConnected, setIsChatConnected] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [userList, setUserList] = useState([]);
  const chatEndRef = useRef(null);

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);
  // 시간을 담을 변수
  const [count, setCount] = useState(30);

  useEffect(() => {
    setHostId(location.state?.hostId || null);
  }, [location.state]);

  const handleStart = async () => {
    setStart(1);
    const response = await axios.post(
      `${baseUrl}/multi/game/${roomId}/start`,
      null, // 요청 본문을 생략
      {
        headers: {
          'memberId': hostId // 헤더에 hostId 추가
        }
      }
    );
    console.log(response.data);
    setProblems(response.data);
  };  

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const initializeConnections = async () => {
      try {
        await connect();
        await enterChat();
      } catch (error) {
        console.log("Connection error:", error);
        reconnectWebSocket();
      }
    };

    initializeConnections();

    const roomId = multiStore.getState().roomId;
    const userId = multiStore.getState().userId;
    const username = multiStore.getState().username;
    console.log(`Room ${roomId}, userId ${userId}, username: ${username}`);

    setUser(username);

    const socketInstance = newSocket(roomId, userId, username);
    setSocket(socketInstance);

    socketInstance.onmessage = (event) => {
      const messageData = event.data;
      if (isJsonString(messageData)) {
        const data = JSON.parse(messageData);

        if (data.type === 'gameStart') { // 게임스타트
          setStart(1);
          console.log(data.payload);
        } else if (data.type === 'newHost') { // 방장바뀌는 타입
          console.log(data.payload);
          setHostId(data.payload);
        }
      } else {
        console.error('Received non-JSON message:', messageData);
      }
    };

    return () => {
      socketInstance.close();
      sendQuitMessage();
      if (chatStompClient.current) chatStompClient.current.disconnect();
    };
  }, []);


  const handleChoiceSelection = (choiceId) => {
    setSelectedChoice(choiceId);
    console.log('선택된 choice ID:', choiceId);
    if (socket && choiceId.trim()) {
      const messageObj = {
          type: 'solve',
          content: {
              "problemType": "MULTIPLE_CHOICE",
              "submitTime": 30-count,
              "solve": (1, choiceId),
              "solveText": null
          }
      };
      socket.send(JSON.stringify(messageObj));
    }
  };


  const renderProblem = () => {
    const problem = problems[currentProblemIndex];
    switch (problem.problemType) {
      case "FILL_IN_THE_BLANK":
        return <FillInTheBlank problem={problem} onChoiceSelect={handleChoiceSelection} />;
      case "SHORT_ANSWER_QUESTION":
        return <ShortAnswer problem={problem} onChoiceSelect={handleChoiceSelection} />;
      case "MULTIPLE_CHOICE":
        return <MultipleChoice problem={problem} onChoiceSelect={handleChoiceSelection} />;
      default:
        return <div>Unknown problem type</div>;
    }
  };

  
  function Timer({ setTimerEnded }) {
    useEffect(() => {
      if (count === 0) {
        setTimerEnded(true);
        return;
      }
  
      // 설정된 시간 간격마다 setInterval 콜백이 실행된다. 
      const id = setInterval(() => {
        // 타이머 숫자가 하나씩 줄어들도록
        setCount((count) => count - 1);
      }, 1000);
      
      // 0이 되면 카운트가 멈춤
      if(count === 0) {
        clearInterval(id);
      }
      return () => clearInterval(id);
      // 카운트 변수가 바뀔때마다 useEffecct 실행
    }, [count, setTimerEnded]);
  
    return <div><span>{count}</span></div>;
  }

    // ---------------------- WebSocket ----------------------

  // WebSocket 연결 및 초기화 함수
  const connect = async () => {
    const chatSocket = new SockJS(`${baseURL}/ws-chat`);
    chatStompClient.current = Stomp.over(chatSocket);

    return new Promise((resolve, reject) => {
      chatStompClient.current.connect(
        {},
        (frame) => {
          console.log("Connected: " + frame);
          console.log("chatStompClient: ", chatStompClient.current);
          setIsChatConnected(true);
          subscribeMessage();
          enterChat(roomId, name);
          console.log("채팅 서버 연결");
          resolve();
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

//   const enterRoom = (roomId, name) => {
//     const chatMessage = {
//       sender: "system",
//       content: `${name} has entered the room.`,
//       type: 'JOIN',
//       roomId: roomId
//   };
//   chatStompClient.current.send(`/send/chat/${roomId}/enter`, {}, JSON.stringify(chatMessage));
// }

  const subscribeMessage = () => {
    const endpoint = `/room/${roomId}`;
    chatStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        body.type === "CHAT"
          ? `${body.sender}: ${body.content}`
          : `${body.content}`,
      ]);
    });
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;
    console.log("send message");
    const endpoint = `/send/chat/${roomId}`;
    const chatMessage = {
      sender: name,
      content: message,
      type: "CHAT",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(chatMessage));
    setMessage("");
  };

  const enterChat = () => {
    const endpoint = `/send/chat/${roomId}/enter`;
    const enterDTO = {
      sender: "system",
      content: `${name}님이 입장하셨습니다.`,
      type: "JOIN",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(enterDTO));
  };

  const sendQuitMessage = () => {
    const endpoint = `/send/chat/${roomId}/leave`;
    const chatMessage = {
      sender: "system",
      content: `${name}님이 퇴장하셨습니다.`,
      type: "LEAVE",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(chatMessage));
  };

  const reconnectWebSocket = () => {
    console.log("Reconnecting WebSocket...");
    setTimeout(async () => {
      try {
        await connect();
      } catch (error) {
        console.error("Reconnection failed: ", error);
        reconnectWebSocket(); // 재연결 시도
      }
    }, 3000); // 3초 후 재연결 시도
  };





  return (
    <>
      <div className="game-container">
        <div className="multi-game-main">
          <div className="multi-game-left">
            <div className="multi-timer">
              {/* start가 1이고 모달이 열려 있지 않으며 타이머가 종료되지 않은 경우에만 타이머를 렌더링 */}
              {start === 1 && !modalOpen && !timerEnded && (
                <Timer setTimerEnded={setTimerEnded} />
              )}
            </div>
            <div className="multi-rank-table">
              {
                userList.map((user, i) => {
                  return <UserRank rank={user.rank} name={user.name} score={user.score} key={i} />
                })
              }
            </div>
          </div>
          <div className="multi-game-center">
            {userList.length === 1 ? (
              <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
              . . . Waiting . . .</h1>
            ) : (
              (start === 0 ? (
                <div className="before-start">
                  <h1>. . . Waiting for start . . .</h1>
                  {/* <button className="game-start-button" onClick={handleStart}>
                    Start
                  </button> */}
                  { hostId == userId ? (
                    <button className="game-start-button" onClick={handleStart}>
                      Start
                    </button>
                  ) : (
                    <div>
                      <h1>대기중 . . .</h1>
                      <h1>방장ID: {hostId}</h1>
                      <h1>니이름: {user}</h1>
                      {/* <MultiResultModal userList={userList} /> */}
                    </div>
                  )}
                </div>
              ) : (
                <div className="after-start">
                  {/* <div>
                    <GameResultModal  />
                  </div> */}
                  {/* <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                  . . . Playing . . .</h1> */}

                  {/* Playing Games! */}
                  {problems.length > 0 && renderProblem()}
                  {/* {timerEnded && submitAnswer(null)} */}
                  {modalOpen && <MultiResultModal userList={userList} />}
                </div>
              ))
            )}
          </div>
          <div className="multi-game-right">
            <div className="multi-round">
              {/* <h1>Round</h1> */}
              { start ? (
                <h1>{ currentProblemIndex+1 } / { problems.length }</h1>
              ) : (
                <h1>Waiting...</h1>
              )}
              
            </div>
            <div className="multi-message-room">
              <MessageContainer chatMessages={chatMessages} user={user} />
            </div>
              <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
        </div>
      </div>
      {/* {modalOpen && <MultiResultModal userList={userList} />} */}
    </>
  );
}

function UserRank(props) {
  return (
    <>
      <div className="multi-rank-items">
        <h3>{props.rank}</h3>
        <h3>{props.name}</h3>
        <h4>{props.score}</h4>
      </div>
    </>
  );
}
