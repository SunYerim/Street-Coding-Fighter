import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import MultiRoom from "../game/MultiRoom.jsx";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function MultiMain() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const baseUrl = "192.168.30.171:8080"

  const loadData = async () => {
    try {
      const response = await axios.get(`http://${baseUrl}/multi/room`);
      if (Array.isArray(response.data)) {
        setRooms(response.data);
      } else {
        console.error('배열을 기대했으나 다음과 같은 데이터를 받았습니다:', response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
      setRooms([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 예시 데이터
  // const exampleRooms = [
  //   { id: 1, title: "가화만사성", headerUser: "Bernie", userCount: 6, isLock: true, password: 1234 },
  //   { id: 2, title: "하나금융 TI", headerUser: "이상현", userCount: 2, isLock: false, password: null },
  //   { id: 3, title: "SSAFY", headerUser: "ssafy", userCount: 100, isLock: false, password: null },
  //   { id: 4, title: "현대 오토에버", headerUser: "방혁님", userCount: 2, isLock: false, password: null },
  //   { id: 5, title: "농구할사람", headerUser: "여대기", userCount: 5, isLock: true, password: 1234 },
  //   { id: 6, title: "롤내전 ㄱ?", headerUser: "김민욱", userCount: 5, isLock: true, password: 1234 },
  //   { id: 7, title: "교회갈사람? (이단 아님)", headerUser: "Ethan", userCount: 100, isLock: false, password: null },
  //   { id: 8, title: "↑↑↑이단임↑↑↑", headerUser: "Jack", userCount: 2, isLock: true, password: 1234 },
  // ]

  const refreshPage = () => {
    window.location.reload();
    loadData();
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
              <h2>Num</h2>
              <h2>PW</h2>
            </div>
            <div className="white-line"></div>
          </div>
          <div className="game-list">
            <div>
              { rooms.length > 0 ? (
                rooms.map((room, i) => {
                  return <MultiRoom roomNum={i+1} room={room.title} hostname={room.hostname} maxPlayer={room.maxPlayer} curPlayer={room.curPlayer} isLock={room.isLock} key={i} />
                })
              ) : (
                <div className="empty-room">
                  <h2>No room yet.</h2>
                </div>
              )}
            </div>
          </div>
        </div>
          <div className="button-container">
            <div>
              <button className="create-button" onClick={refreshPage}>Refresh</button>
            </div>
            <div>
              <button className="create-button" onClick={() => navigate("/multi/create")}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

