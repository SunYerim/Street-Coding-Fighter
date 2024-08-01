import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordModal.jsx";
import lock from '/lock.svg'
import unlock from '/unlock.svg'

function MultiRoom(props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseUrl = "http://ssafy11s.com/api"

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCloseModal();
  };

  const handleRoomEntry = async (password = '') => {
    try {
      const response = await fetch(`${baseUrl}/multi/room/${props.roomNum}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomPassword: password }) // 비밀번호 또는 빈 문자열
      });

      if (response.ok) {
        navigate("/multi-game");
        // navigate(`${baseUrl}/multi/room/${props.roomNum}`);
      } else {
        alert("Failed to enter the room. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error entering the room.");
    }
  };

  const handleRoomClick = () => {
    if (props.isLock) {
      handleOpenModal();
    } else {
      navigate("/multi-game");
      // handleRoomEntry();
    }
  };


  return(
    <>
    <div className='room-items' onClick={handleRoomClick}>
        <h3>{props.roomNum}</h3>
        <h3>{props.roomTitle}</h3>
        <h4>{props.headerUser}</h4>
        <h4>{props.userCur} / {props.userMax}</h4>
        <img src={props.isLock ? lock : unlock} alt="lock" />
      </div>
        {isModalOpen && (
          <PasswordModal
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        )}
    </>
  )
}

export default MultiRoom;