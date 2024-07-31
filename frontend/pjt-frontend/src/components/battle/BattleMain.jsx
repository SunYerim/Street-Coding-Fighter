import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import Button from "./Button.jsx";
import BattleRoom from "../game/BattleRoom.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BattleMain() {
  const navigate = useNavigate();
  // const [rooms, setRooms] = useState([]);

  // 예시 데이터
  const exampleRooms = [
    { id: 1, title: "가화만사성", headerUser: "Bernie", userCount: 6, isLock: true, password: 1234 },
    { id: 2, title: "하나금융 TI", headerUser: "이상현", userCount: 2, isLock: false, password: null },
    { id: 3, title: "SSAFY", headerUser: "ssafy", userCount: 100, isLock: false, password: null },
    { id: 4, title: "현대 오토에버", headerUser: "방혁님", userCount: 2, isLock: false, password: null },
    { id: 5, title: "농구할사람", headerUser: "여대기", userCount: 5, isLock: true, password: 1234 },
    { id: 6, title: "롤내전 ㄱ?", headerUser: "김민욱", userCount: 5, isLock: true, password: 1234 },
    { id: 7, title: "교회갈사람? (이단 아님)", headerUser: "Ethan", userCount: 100, isLock: false, password: null },
    { id: 8, title: "↑↑↑이단임↑↑↑", headerUser: "Jack", userCount: 2, isLock: true, password: 1234 },
    
  ]

  const refreshPage = () => {
    window.location.reload();
  }

  return (
    <>
      <div className="container">
        <div className="sub-container">
        <div className="list-container">
          <div className="game-list-header">
            <div className="game-room-index">
              <h2>No.</h2>
              <h2>Title</h2>
              <h2>King</h2>
              <h2>Limit</h2>
              <h2>PW</h2>
            </div>
            <div className="white-line"></div>
          </div>
          <div className="game-list">
            <div>
              {
                exampleRooms.map((room, i) => {
                  return <BattleRoom roomNum={i+1} room={room.title} headerUser={room.headerUser} maxNum={room.userCount} isLock={room.isLock} key={room.id} />
                })
              }
            </div>
          </div>
        </div>
          <div className="button-container">
            <div>
              <button className="create-button" onClick={refreshPage}>Refresh</button>
            </div>
            <div>
              <button className="create-button" onClick={() => navigate("/multi-create")}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
