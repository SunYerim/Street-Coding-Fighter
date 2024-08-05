import '../../index.css';
import '../../css/GameMain.css';
import "../../css/MultiGame.css";
import '../../css/Timer.css';
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
import MultiResultModal from "./MultiResultModal.jsx";
import newSocket from "../game/server.js"
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import multiStore from '../../stores/multiStore.jsx';
import axios from 'axios';

import FillInTheBlank from "../game/FillInTheBlank";
import ShortAnswer from "../game/short_answer/ShortAnswer";
import MultipleChoice from "../game/MultipleChoice";

// const baseUrl = "https://www.ssafy11s.com"; // ssafy11s.com으로 수정하기
const baseUrl = "http://localhost:8080"


export default function MultiGame() {
  const navigate = useNavigate();
  const location = useLocation();

  const roomId = multiStore.getState().roomId;
  const userId = multiStore.getState().userId;
  const username = multiStore.getState().username;

  const [socket, setSocket] = useState(null);
  const [start, setStart] = useState(0);
  const [hostId, setHostId] = useState(null);
  const [user, setUser] = useState(username);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [userList, setUserList] = useState([]);
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
    const roomId = multiStore.getState().roomId;
    const userId = multiStore.getState().userId;
    const username = multiStore.getState().username;

    setUser(username);

    console.log(`Room ${roomId}, userId ${userId}, username: ${username}`);

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

        setMessageList((prevMessageList) => [...prevMessageList, data]);
      } else {
        console.error('Received non-JSON message:', messageData);
        setMessageList((prevMessageList) => [...prevMessageList, { text: messageData }]);
      }
    };

    return () => {
      socketInstance.close();
    };
  }, []);


  const sendMessage = () => {
    if (socket && message.trim()) {
        const messageObj = {
            type: 'chat',
            content: {
                text: message.trim()
            }
        };
        socket.send(JSON.stringify(messageObj));
        setMessage('');
    }
  };

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


  // 3. 답보내기
  // const submitAnswer = (answer) => {
  //   socket.send(JSON.stringify({ event: 'solve', answer }));
  // };

  // const submitAnswer = (answer) => {
  //   if (socket && answer.trim()) {
  //       const messageObj = {
  //           type: 'solve',
  //           content: {
  //               solve: answer.trim()
  //           }
  //       };
  //       socket.send(JSON.stringify(messageObj));
  //   }
  // };

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
            {/* <div className="multi-message-room">
              <MessageContainer messageList={messageList} user={user} />
            </div>
              <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} /> */}
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
