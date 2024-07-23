import "../../index.css";
import "../../css/GameMain.css";
import Button from "./Button.jsx";
import InputField from "./InputField.jsx";
import MessageContainer from "./MessageContainer.jsx";
import socket from "./server.js"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function MultiGame() {
  const navigate = useNavigate();
  const [start, setStart] = useState(0);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const handleStart = () => {
    setStart(1);
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });
    askUserName();
  }, []);


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
        <div className="game-main">
          <div className="game-header">
            <h2>Waiting for start. . .</h2>
          </div>
          <div className="game-body">
            <div className="rank-table">

            </div>
            
              <div className="game-content">
              {start === 0 ? (
                <button className="game-start-button" onClick={handleStart}>
                  Start
                </button>
              ) : (
                <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                  . . . Playing . . .</h1>
              )}
            </div>
            <div className="chat-room">
              <div className="message-room">
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
