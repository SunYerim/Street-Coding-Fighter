import "../../index.css";
import "../../css/GameMain.css";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiMain() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // 예시 데이터
  const exampleRooms = [
    { id: 1, title: "가화만사성", headerUser: "Bernie", userCount: 6 },
    { id: 2, title: "하나금융 TI", headerUser: "이상현", userCount: 1 },
    { id: 3, title: "SSAFY", headerUser: "ssafy", userCount: 100 },
    { id: 4, title: "현대 오토에버", headerUser: "방혁님", userCount: 1 },
    { id: 5, title: "농구할사람", headerUser: "여대기", userCount: 5 },
    { id: 6, title: "롤내전 ㄱ?", headerUser: "김민욱", userCount: 5 },
    { id: 7, title: "교회갈사람? (이단 아님)", headerUser: "Ethan", userCount: 100 },
    { id: 8, title: "↑↑↑이단임↑↑↑", headerUser: "Jack", userCount: 1 },
    
  ]

  const refreshPage = () => {
    window.location.reload();
  }

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
        <div className="list-container">
          <div className="game-list">
            <div>
              {
                exampleRooms.map((room, i) => {
                  return <Room roomNum={i+1} room={room.title} headerUser={room.headerUser} maxNum={room.userCount} key={room.id} />
                })
              }
            </div>
          </div>
          <div className="button-container">
            <div className="game-button">
              <Button text={"Refresh"} onClick={refreshPage} />
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

// 룸 컴포넌트
function Room(props) {
  return(
    <div className='room-items' >
      <h3>{ props.roomNum }. { props.room }</h3>
      <h4>방장: { props.headerUser }</h4>
      <h4>{ props.maxNum }인 방</h4>
    </div>
  )
}
