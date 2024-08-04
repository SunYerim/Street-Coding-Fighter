import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import PasswordModal from "./PasswordModal.jsx";
import axios from "axios";
import lock from '/lock.svg'
import unlock from '/unlock.svg'

  //*** ssafy11s.com으로 수정하기
  const baseUrl = "localhost:8080";
  //*** 스토어에서 꺼내오기
  const memberId = 35;
  const username = "hermes";

function MultiRoom(props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    console.log(password);
    const headers = {
      'memberId': memberId,
      'username': username
    };
    
    try {
      const response = await axios.post(`http://localhost:8080/multi/room/${props.roomId}`, password, {
        headers: {
          ...headers,
          'Content-Type': 'text/plain'
        }
      });
      if (response.status === 200) {
        navigate(`/multi/room/${props.roomId}`, { state: { roomId: props.roomId, userId: memberId, username: username } });
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      console.error('Error entering the room:', error);
      // 실패 모달창
      setErrorMessage("잘못된 비밀번호입니다!"); 
      openModal();
      // alert('Failed to enter the room');
    }
    handleCloseModal();
  };

  const handleRoomClick = () => {
    if (props.isLock) {
      handleOpenModal();
    } else {
      navigate(`/multi/room/${props.roomId}`, { state: { roomId: roomId, userId: memberId, username: username } });
    }
  };

  const warningSign = "/warningSign.png"
  return(
    <>
      <div className='room-items' onClick={handleRoomClick}>
        <h3>{props.roomNum}</h3>
        <h3>{props.room}</h3>
        <h4>{props.hostname}</h4>
        <h4>{props.curPlayer} / {props.maxPlayer}</h4>
        <img src={props.isLock ? lock : unlock} alt="lock" />
      </div>
        {isModalOpen && (
          <PasswordModal
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Alert Modal"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-container">
            <img className="warning-img" src={warningSign} alt="warning-sign" />
            <h4 className="warning-text">{errorMessage}</h4>
          </div>
        </Modal>
    </>
  )
}

export default MultiRoom;