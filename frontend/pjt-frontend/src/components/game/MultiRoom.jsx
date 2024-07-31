import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordModal.jsx";
import lock from '/lock.svg'
import unlock from '/unlock.svg'

function MultiRoom(props) {
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
    handleCloseModal();
  };

  const handleRoomClick = () => {
    if (props.isLock) {
      handleOpenModal();
    } else {
      navigate("/multi-game");
      // navigate(`/multi/room/${props.roomNum}`);
    }
  };


  return(
    <>
    <div className='room-items' onClick={handleRoomClick}>
        <h3>{props.roomNum}</h3>
        <h3>{props.room}</h3>
        <h4>{props.headerUser}</h4>
        <h4>{props.maxNum}인 방</h4>
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