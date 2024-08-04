import "../../index.css";
import "../../css/GameMain.css";
import "../../css/MultiGame.css";
import '../../css/Timer.css';
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
import MultiResultModal from "./MultiResultModal.jsx";
import newSocket from "../game/server.js"
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FillInTheBlank from "../game/FillInTheBlank";
import ShortAnswer from "../game/short_answer/ShortAnswer";
import MultipleChoice from "../game/MultipleChoice";


export default function MultiGame() {
  const navigate = useNavigate();

  const location = useLocation();
  const { roomId, userId, username } = location.state;
  // const socket = newSocket(roomId, userId, username);

  const [socket, setSocket] = useState(null);
  const [start, setStart] = useState(0);
  const [headerUser, setHeaderUser] = useState('');
  const [user, setUser] = useState(username);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [userList, setUserList] = useState([]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);
  // 시간을 담을 변수
  const [count, setCount] = useState(30);


  const handleStart = () => {
    setStart(1);
    if (socket) {
      const messageObj = {
          type: 'start_game',
          content: {}
      };
      socket.send(JSON.stringify(messageObj));
  }
  };

  // 문제요청 함수
  // 2. 문제받기 정의
  // const requestProblems = (gameRound) => {
  //   socket.send(JSON.stringify({ event: 'requestProblems', gameRound }));
  // };

  useEffect(() => {
    console.log(`Room ${roomId}, userId ${userId}, username: ${username}`);

    const socketInstance = newSocket(roomId, userId, username);
    setSocket(socketInstance);

    console.log(user);

    socketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'start_game') {
        setStart(1);
        console.log(data.message); // "Game has started!" 메시지 출력
      }

      setMessageList((prevMessageList) => [...prevMessageList, event.data]);
    };

    return () => {
      socketInstance.close();
    };
  }, []);

  // useEffect(() => {

    // if (socket) {
    //   socket.on('message', (message) => {
    //     console.log('WebSocket message received:', message);
    //   });

    //   // 컴포넌트 언마운트 시 소켓 연결 해제
    //   return () => {
    //     socket.disconnect();
    //   };
    // }
  // }, [socket]);


    // 메세지 목록 업데이트
    // 1. 메세지 주고받기
    // socket.on("message", (message) => {
    //   setMessageList((prevState) => prevState.concat(message));
    // });

    // 임시) 유저정보 받기
    // askUserName();

    // 유저 리스트 이벤트를 수신하고 유저 목록을 업데이트
    // 0. 입장한 유저정보 받기
    // socket.on('userList', (user) => {
    //   setUserList(user);
    // });
    // socket.on('headerUser', (headerUser) => {
    //   setHeaderUser(headerUser);
    // });

    // socket.on('gameStart', () => {
    //   setStart(1);
    //   requestProblems(3);
    // })

    // socket.on('roundEnd', () => {
    //   setModalOpen(true); // 라운드 종료 시 모달 창 열기
    //   setTimeout(() => {
    //     setModalOpen(false);  // 5초 후 모달 창 닫기
    //     if (currentProblemIndex < problems.length - 1) {
    //       setCurrentProblemIndex(currentProblemIndex + 1); // 다음 문제로 인덱스 증가
    //       setTimerEnded(false); // 타이머 상태 리셋
    //     } else {
    //       setStart(0); // 모든 라운드가 끝났다면 게임 대기 상태로 전환
    //     }  
    //   }, 5000);
    // });


    // 컴포넌트가 언마운트될 때 이벤트 수신 해제
    // return () => {
    //   socket.off('message');
    //   socket.off('userList');
    //   socket.off('headerUser');
    //   socket.off('gameStart');
    //   socket.off('roundEnd');
    // };
  // }, [currentProblemIndex, problems.length]);


  // const askUserName = () => {
  //   const userName = prompt("이름입력ㄱㄱ");

  //   socket.emit("login", userName, (res) => {
  //     if(res?.ok) {
  //       setUser(res.data);
  //     }
  //   });
  // };

  
  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   socket.send(JSON.stringify({ event: 'chat', message }));
  //   // socket.emit("sendMessage", message, (res)=> {
  //   //   console.log("sendMessage res", res);
  //   // });
  //   setMessage('');
  // };

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


  // 3. 답보내기
  // const submitAnswer = (answer) => {
  //   socket.send(JSON.stringify({ event: 'solve', answer }));
  // };

  const submitAnswer = (answer) => {
    if (socket && answer.trim()) {
        const messageObj = {
            type: 'solve',
            content: {
                solve: answer.trim()
            }
        };
        socket.send(JSON.stringify(messageObj));
    }
};

  const renderProblem = () => {
    const problem = problems[currentProblemIndex];
    switch (problem.problemType) {
      case "FILL_IN_THE_BLANK":
        return <FillInTheBlank problem={problem} />;
      case "SHORT_ANSWER_QUESTION":
        return <ShortAnswer problem={problem} submitTime={count} />;
      case "MULTIPLE_CHOICE":
        return <MultipleChoice problem={problem} />;
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
                  { headerUser == user ? (
                    <button className="game-start-button" onClick={handleStart}>
                      Start
                    </button>
                  ) : (
                    <div>
                      <h1>대기중 . . .</h1>
                      <h1>헤더유저: {headerUser}</h1>
                      <h1>니이름: {user}</h1>
                      {/* <MultiResultModal userList={userList} /> */}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* <div>
                    <GameResultModal  />
                  </div> */}
                  {/* <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                  . . . Playing . . .</h1> */}

                  {/* Playing Games! */}
                  {problems.length > 0 && renderProblem()}
                  {timerEnded && submitAnswer(null)}
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
              <MessageContainer messageList={messageList} user={user} />
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
