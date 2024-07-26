import "../../index.css";
import "../../css/GameMain.css";
import lock from '/lock.svg'
import unlock from '/unlock.svg'
import Button from "./Button.jsx";
import PasswordModal from "../game/PasswordModal.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BattleMain() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // 예시 데이터
  const exampleRooms = [
    { id: 1, title: "가화만사성", headerUser: "Bernie", userCount: 6, isLock: true },
    { id: 2, title: "하나금융 TI", headerUser: "이상현", userCount: 2, isLock: false },
    { id: 3, title: "SSAFY", headerUser: "ssafy", userCount: 100, isLock: false },
    { id: 4, title: "현대 오토에버", headerUser: "방혁님", userCount: 2, isLock: false },
    { id: 5, title: "농구할사람", headerUser: "여대기", userCount: 5, isLock: true },
    { id: 6, title: "롤내전 ㄱ?", headerUser: "김민욱", userCount: 5, isLock: true },
    { id: 7, title: "교회갈사람? (이단 아님)", headerUser: "Ethan", userCount: 100, isLock: false },
    { id: 8, title: "↑↑↑이단임↑↑↑", headerUser: "Jack", userCount: 2, isLock: true },
    
  ]

  const refreshPage = () => {
    window.location.reload();
  }


  return (
    <>
      <div className="container">
        <div className="list-container">
          <div className="game-list">
            <div>
              {
                exampleRooms.map((room, i) => {
                  return <Room roomNum={i+1} room={room.title} headerUser={room.headerUser} maxNum={room.userCount} isLock={room.isLock} key={room.id} />
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
          </div>
        </div>
      </div>
    </>
  );
}


// 룸 컴포넌트
function Room(props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle password submission logic
    handleCloseModal();
  };

  const handleRoomClick = () => {
    if (props.isLock) {
      handleOpenModal();
    } else {
      navigate("/multi-game");
    }
  };


  return(
    <>
    <div className='room-items' onClick={handleRoomClick}>
        <h3>{props.roomNum}. {props.room}</h3>
        <h4>방장: {props.headerUser}</h4>
        <h4>{props.maxNum}인 방</h4>
        <img src={props.isLock ? lock : unlock} alt="lock" />
      </div>
        {isModalOpen && (
          <PasswordModal onClose={handleCloseModal} onSubmit={handleSubmit} />
        )}
    </>
  )
}