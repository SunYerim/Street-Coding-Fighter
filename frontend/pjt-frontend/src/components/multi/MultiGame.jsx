import "../../index.css";
import "../../css/GameMain.css";
import "../../css/MultiGame.css";
import Timer from "../game/Timer.jsx";
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
import GameResultModal from "../game/GameResultModal.jsx";
import socket from "../game/server.js"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function MultiGame() {
  const navigate = useNavigate();
  const [start, setStart] = useState(0);
  const [headerUser, setHeaderUser] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomId, setRoomId] = useState('defaultRoomId');

  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);

  // const userList = [
  //   { id: 1, rank: 2, name: "방장", score: 97 },
  //   { id: 2, rank: 1, name: "B", score: 100 },
  //   { id: 3, rank: 3, name: "F", score: 90 },
  //   { id: 4, rank: 4, name: "S", score: 80 },
  //   { id: 5, rank: 5, name: "H", score: 70 },
  //   { id: 6, rank: 6, name: "E", score: 60 },
  //   { id: 7, rank: 7, name: "J", score: 30 },
  //   { id: 7, rank: 7, name: "말숙", score: 50 },
  //   { id: 7, rank: 7, name: "ai", score: 90 },
  // ];


  const handleStart = () => {
    setStart(1);
    socket.emit("start");
  };  
  

  // useEffect(() => {
  //   setModalOpen(true)
  // }, [round])


  useEffect(() => {
    socket.emit("start");
  }, [start]);


  useEffect(() => {
    // 메세지 목록 업데이트
    socket.on("message", (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });

    // 임시) 유저정보 받기
    askUserName();

    // 유저 리스트 이벤트를 수신하고 유저 목록을 업데이트
    socket.on('userList', (user) => {
      setUserList(user);
    });

    socket.on('headerUser', (headerUser) => {
      setHeaderUser(headerUser);
      console.log(headerUser);
    });

    // 컴포넌트가 언마운트될 때 이벤트 수신 해제
    return () => {
      socket.off('message');
      socket.off('userList');
      socket.off('headerUser');
    };
  }, []);

  // // 문제요청 함수
  // const requestProblems = (limit) => {
  //   socket.emit('requestProblems', limit, (response) => {
  //     if (response.ok) {
  //       setProblems(response.problems);
  //     } else {
  //       console.error(response.err);
  //     }
  //   });
  // };

  // // 게임 시작 시 요청
  // useEffect(() => {
  //   // 예시로 문제 3개를 요청
  //   requestProblems(3);
  // }, [start]);


  const askUserName = () => {
    const userName = prompt("이름입력ㄱㄱ");

    socket.emit("login", userName, (res) => {
      if(res?.ok) {
        setUser(res.data);
        console.log(res.data);
        console.log(user.name);
      }
    });
  };

  
  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res)=> {
      console.log("sendMessage res", res);
    });
    setMessage('');
  };


  return (
    <>
      <div className="game-container">
        <div className="multi-game-main">
          <div className="multi-game-left">
            <div className="multi-timer">
              <Timer />
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
                  { headerUser == user.name ? (
                    <button className="game-start-button" onClick={handleStart}>
                      Start
                    </button>
                  ) : (
                    <div>
                      <h1>대기중 . . .</h1>
                      <h1>헤더유저: {headerUser}</h1>
                      <h1>니이름: {user.name}</h1>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* <div>
                    <GameResultModal  />
                  </div> */}
                  <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                  . . . Playing . . .</h1>
                </div>
              ))
            )}
          </div>
          <div className="multi-game-right">
            <div className="multi-round">
              <p>~Round~</p>
            </div>
            <div className="multi-message-room">
              <MessageContainer messageList={messageList} user={user} />
            </div>
              <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
          </div>
        </div>
      </div>
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
