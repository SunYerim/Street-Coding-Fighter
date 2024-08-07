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
import createAuthClient from "../sanghyeon/apis/createAuthClient.js";
import axios from 'axios';

import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

import FillInTheBlank from "../game/fillInTheBlank/FillInTheBlank";
import ShortAnswer from "../game/short_answer/ShortAnswer";
import MultipleChoice from "../game/MultipleChoice";


export default function MultiGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatStompClient = useRef(null);

  // 유저정보 받아오기
  const {
    accessToken,
    setAccessToken,
    memberId,
    userId,
    name,
    baseURL,
  } = store((state) => ({
    memberId: state.memberId,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    userId: state.userId,
    name: state.name,
    baseURL: state.baseURL,
  }));

  // auth
  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const roomId = multiStore.getState().roomId;

  const [socket, setSocket] = useState(null);
  const [start, setStart] = useState(0);
  const [hostId, setHostId] = useState(null);

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const [problems, setProblems] = useState([]);
  const [problemType, setProblemType] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [userList, setUserList] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [roundRankList, setRoundRankList] = useState([]);
  const chatEndRef = useRef(null);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);

  const [count, setCount] = useState(30);

  // 방생성할때 방장의 memberId 가져오기
  useEffect(() => {
    setHostId(location.state?.hostId || null);
  }, [location.state]);

  // 게임시작
  const handleStart = async () => {
    setStart(1);  
    const response = await axios.post(
      `${baseURL}/multi/game/${roomId}/start`,
      null, // 요청 본문을 생략
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // 'memberId': hostId, // 헤더에 hostId 추가
        }
      }
    );
  };

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // 마운트할 때
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
    // console.log(`Room ${roomId}, userId ${memberId}, username: ${name}`);

    const socketInstance = newSocket(roomId, memberId, name);
    setSocket(socketInstance);

    socketInstance.onmessage = (event) => {
      const messageData = event.data;
      if (isJsonString(messageData)) {
        const data = JSON.parse(messageData);

        // Multi socket 통신 타입별 정리
        if (data.type === 'gameStart') { // 게임스타트
          console.log("Game started 신호는 왔음");
          setStart(1);
          console.log(data.payload);
          const parsedPayload = JSON.parse(data.payload);
          setProblems(parsedPayload);
          console.log('parsedPayload: ', parsedPayload)
          console.log('parsedPayload.data: ', parsedPayload.data)
        } else if (data.type === 'newHost') { // 방장바뀌는 타입
          console.log(data.payload);
          setHostId(data.payload);
        } else if (data.type === 'attainScore') {
          console.log(`얻은 점수: ${data.payload}`);
        } else if (data.type === 'gameRank') {
          setRankList(data.payload);
          setTimerEnded(true);
          console.log('전체랭킹: ',rankList);
        } else if (data.type === 'roundRank') { 
          setRoundRankList(data.payload);
          console.log('라운드랭킹: ',roundRankList);
        }
      } else {
        console.log("이거 json 맞는데?", messageData);
        console.error('Received non-JSON message:', messageData);
        console.log('Received non-JSON message:', messageData);
      }
    };

    return () => {
      socketInstance.close();
      sendQuitMessage();
      if (chatStompClient.current) chatStompClient.current.disconnect();
    };
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // 문제 받기
  useEffect(() => {
    if (problems.length > 0) {
      setProblemType(problems[currentProblemIndex].problemType);
    }
  }, [problems, currentProblemIndex]);


  // 라운드 종료 후 랭킹 모달 표시
  useEffect(() => {
    if (start === 1 && !modalOpen && timerEnded) {
      if (currentProblemIndex < problems.length - 1) {
        // 모달 열고 4초 대기
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
        }, 4000);

        // 문제번호++, 제출상태 초기화
        setCurrentProblemIndex(currentProblemIndex + 1);
        setIsSubmit(false);
      } else {
        setResultModalOpen(true);
        setTimeout(() => {
          setResultModalOpen(false);
          setStart(0);
        }, 4000);
      }
    }
  }, [rankList]);



  // 객관식 답변제출
  const handleChoiceSelection = (choiceId) => {
    console.log('선택된 choice ID:', choiceId);
    if (socket && choiceId) {
      const messageObj = {
          type: 'solve',
          content: {
              "problemType": "MULTIPLE_CHOICE",
              "submitTime": 30-count,
              "solve": {1 : choiceId},
              "solveText": null
          }
      };
      socket.send(JSON.stringify(messageObj));
      setIsSubmit(true);
    }
  };

  // 단답식 답변제출
  const handleShortAnswer = (answer) => {
    console.log('제출한 답:', answer);
    if (socket && answer.trim().replace(/\s+/g, '')) {
      const messageObj = {
          type: 'solve',
          content: {
              "problemType": "SHORT_ANSWER_QUESTION",
              "submitTime": 30-count,
              "solve": null,
              "solveText": answer
          }
      };
      socket.send(JSON.stringify(messageObj));
      setIsSubmit(true);
    }
  };

  // 빈칸 답변제출
  const handleBlankAnswer = (blankList) => {
    console.log('제출한 답:', blankList);
    if (socket && blankList) {
      const messageObj = {
          type: 'solve',
          content: {
              "problemType": "FILL_IN_THE_BLANK",
              "submitTime": 30-count,
              "solve": blankList,
              "solveText": null
          }
      };
      socket.send(JSON.stringify(messageObj));
      setIsSubmit(true);
    }
  };

  const renderProblem = () => {
    const problem = problems[currentProblemIndex];
    return problem ? (
      <>
        {problem.problemType === "FILL_IN_THE_BLANK" && (
          <FillInTheBlank problem={problem} onFillBlank={handleBlankAnswer} />
        )}
        {problem.problemType === "SHORT_ANSWER_QUESTION" && (
          <ShortAnswer problem={problem} onShortAnswer={handleShortAnswer} />
        )}
        {problem.problemType === "MULTIPLE_CHOICE" && (
          <MultipleChoice problem={problem} onChoiceSelect={handleChoiceSelection} />
        )}
      </>
    ) : (
      <div>Unknown problem type</div>
    );
  };

  
  function Timer({ setTimerEnded }) {
    useEffect(() => {
      if (count <= 0) {
        setTimerEnded(true);
        return;
      }
  
      const id = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(id);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
  
      return () => clearInterval(id);
    }, [count]);


    useEffect(() => {
      if (count === 0 && !isSubmit) {
        switch (problemType) {
          case "FILL_IN_THE_BLANK":
            handleBlankAnswer(null);
            setIsSubmit(true);
            break;
          case "SHORT_ANSWER_QUESTION":
            handleShortAnswer(null);
            setIsSubmit(true);
            break;
          case "MULTIPLE_CHOICE":
            handleChoiceSelection(null);
            setIsSubmit(true);
            break;
          default:
            console.log("Unknown problem type: " + problemType);
        }
        // setModalOpen(true);
        // setTimeout(() => {
        //   setModalOpen(false);
        // }, 4000);
      }
    }, [count, isSubmit, problemType]);

  
    return <div><span>{count}</span></div>;
  }

  // ---------------------- 채팅 WebSocket ----------------------

  // 채팅 WebSocket 연결 및 초기화 함수
  const connect = async () => {
    const chatSocket = new SockJS(`https://www.ssafy11s.com/ws-chat`);
    chatStompClient.current = Stomp.over(chatSocket);

    return new Promise((resolve, reject) => {
      chatStompClient.current.connect(
        {},
        (frame) => {
          subscribeMessage();
          resolve();
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  const subscribeMessage = () => {
    const endpoint = `/room/${roomId}`;
    chatStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        body.type === "CHAT"
        ? { sender: body.sender, content: body.content }
        : body.type === "JOIN"
        ? { sender: "system", content: `${body.sender}님이 입장하셨습니다.` } 
        : { sender: "system", content: `${body.sender}님이 퇴장하셨습니다.` },
      ]);
    });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") return;
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
      sender: name,
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
    }, 2000); // 3초 후 재연결 시도
  };


  // ---------------------- 채팅 WebSocket ----------------------


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
                rankList.map((user, i) => {
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
                  { hostId == memberId ? (
                    <button className="game-start-button" onClick={handleStart}>
                      Start
                    </button>
                  ) : (
                    <div>
                      {/* <h1>대기중 . . .</h1>
                      <h1>방장ID: {hostId}</h1>
                      <h1>니이름: {name}</h1> */}
                      {/* <MultiResultModal roundRankList={roundRankList} /> */}
                    </div>
                  )}
                </div>
              ) : (
                <div className="after-start">
                  {/* <div>
                    <GameResultModal  />
                  </div> */}
                  
                  {/* Playing Games! */}
                  {problems.length > 0 && renderProblem()}
                  {/* {timerEnded && submitAnswer(null)} */}
                  {/* {modalOpen && <MultiResultModal roundRankList={roundRankList} />} */}
              </div>
              ))
            )}
          </div>
          <div className="multi-game-right">
            <div className="multi-round">
              { start ? (
                <h1>{ currentProblemIndex+1 } / { problems.length }</h1>
              ) : (
                <h1>Round</h1>
              )}
            </div>
            <div className="multi-message-room">
              <MessageContainer chatMessages={chatMessages} username={name} />
            </div>
              <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
        </div>
      </div>
      {modalOpen && <MultiResultModal roundRankList={roundRankList} />}
      {resultModalOpen && <MultiResultModal rankList={rankList} />}
      
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
