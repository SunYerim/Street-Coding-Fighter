import "../../index.css";
import "../../css/GameMain.css";
import "../../css/BattleGame.css";
import Timer from "../game/Timer.jsx";
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
// import socket from "../game/server.js"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function BattleGame() {
  const navigate = useNavigate();
  const [start, setStart] = useState(0);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const userList = [
    { id: 1, rank: 2, name: "방장", score: 97 },
    { id: 2, rank: 1, name: "B", score: 100 },
    { id: 3, rank: 3, name: "F", score: 90 },
    { id: 4, rank: 4, name: "S", score: 80 },
    { id: 5, rank: 5, name: "H", score: 70 },
    { id: 6, rank: 6, name: "E", score: 60 },
    { id: 7, rank: 7, name: "J", score: 30 },
    { id: 7, rank: 7, name: "말숙", score: 50 },
    { id: 7, rank: 7, name: "ai", score: 90 },
  ];


  const handleStart = () => {
    setStart(1);
  };

  // useEffect(() => {
  //   socket.on("message", (message) => {
  //     setMessageList((prevState) => prevState.concat(message));
  //   });
  //   askUserName();
  // }, []);


  const askUserName = () => {
    const userName = prompt("이름입력ㄱㄱ");

    socket.emit("login", userName, (res) => {
      // res가 왔는데(?), ok정보가 true이다.
      if(res?.ok) {
        setUser(res.data);
      }
    });
  };

  
  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res)=> {
      console.log("sendMessage res", res);
    });
    // socket.emit("sendMessage", message);
    // setMessage('');
  };


  return (
    <>
      <div className="game-container">
        <div className="battle-game-main">
          <div className="battle-game-header">
            <div className="your-hp">
              <p>your hp</p>
            </div>
            <div className="battle-status">
              <div className="battle-round">
                <p>~Round~</p>
              </div>
              <div className="battle-timer">
                <Timer />
              </div>
            </div>
            <div className="my-hp">
            <p>my hp</p>
            </div>
          </div>
          <div className="battle-game-body">
            <div className="battle-game-left">
              <div className="your-video">
              <p>your video</p>
              </div>
              <div className="battle-rank-table">
                {
                  userList.map((user, i) => {
                    return <UserRank rank={user.rank} name={user.name} score={user.score} key={i} />
                  })
                }
              </div>
            </div>
            <div className="battle-game-center">
              {userList.length === 1 ? (
                <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                . . . Waiting . . .</h1>
              ) : (
                (start === 0 ? (
                  <div className="before-start">
                    <h2>. . . Waiting for start . . .</h2>
                    <button className="game-start-button" onClick={handleStart}>
                      Start
                    </button>
                  </div>
                ) : (
                  <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                    . . . Playing . . .</h1>
                ))
              )}
            </div>
            <div className="battle-game-right">
              <div className="my-video">
                <p>my video</p>
              </div>
              <div className="battle-message-room">
                <MessageContainer messageList={messageList} user={user} />
              </div>
                <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function UserRank(props) {
  return (
    <>
      <div className="battle-rank-items">
        <h3>{props.rank}</h3>
        <h3>{props.name}</h3>
        <h4>{props.score}</h4>
      </div>
    </>
  );
}
