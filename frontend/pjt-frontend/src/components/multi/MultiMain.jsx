import "../../index.css";
import "../../css/GameMain.css";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiMain() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // const fetchRooms = async () => {
  //   try {
  //     const response = await fetch("/multi/room/{userId}"); // Replace with your API endpoint
  //     const data = await response.json();
  //     setRooms(data);
  //   } catch (error) {
  //     console.error("Failed to fetch rooms:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRooms();
  // }, []);

  return (
    <>
      <div className="container">
        <div className="game-container">
          <div className="game-list">
            {/* {rooms.map((room) => (
              // room-item 클래스 css 만들어야함
              <div key={room.id} className="room-item">
                // 룸 컴포넌트 생성
                {room.name}
              </div>
            ))} */}
          </div>
          <div className="button-container">
            <div className="game-button">
              <Button text={"Refresh"} />
            </div>
            <div className="game-button">
              <Button text={"Create"} onClick={() => navigate("/multi-create")} />
            </div>
            {/* <div className="game-button">
              <Button text={"Multi"} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
