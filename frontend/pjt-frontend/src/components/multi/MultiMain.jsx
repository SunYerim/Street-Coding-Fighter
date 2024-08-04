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

  const baseUrl = "localhost:8080"

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
                  return <MultiRoom roomNum={i+1} room={room.title} hostname={room.hostname} maxPlayer={room.maxPlayer} curPlayer={room.curPlayer} isLock={room.isLock} roomId={room.roomId} key={i} />
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

