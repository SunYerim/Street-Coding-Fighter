import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import PasswordModal from "./PasswordModal.jsx";
import axios from "axios";
import lock from '/lock.svg'
import unlock from '/unlock.svg'
import multiStore from '../../stores/multiStore.jsx';
import store from '../../store/store.js';
import createAuthClient from "../sanghyeon/apis/createAuthClient.js";

function MultiRoom(props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

    const setRoomId = multiStore((state) => state.setRoomId);

  const {
    accessToken,
    setAccessToken,
    memberId,
    userId,
    name,
    baseURL,
  } = store((state) => ({
    memberId: state.memberId,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    userId: state.userId,
    name: state.name,
    baseURL: state.baseURL,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // const setUserId = multiStore((state) => state.setUserId);
  // const setUsername = multiStore((state) => state.setUsername);

  // useEffect(() => {
  //   const userIdFromStore = multiStore.getState().userId;
  //   const usernameFromStore = multiStore.getState().username;

  //   setLocalUserId(userIdFromStore);
  //   setLocalUsername(usernameFromStore);

  //   setUserId(userIdFromStore);
  //   setUsername(usernameFromStore);
  // }, [setUserId, setUsername]);

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

  const handleSubmit = async (password) => {
    
    try {

      const response = await axios.post(
        `${baseURL}/multi/room/${props.roomId}`,
        password,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
          }
        }
      );

      if (response.status === 200) {
        setRoomId(props.roomId);
        navigate(`/multi-game/${props.roomId}`);
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
      setRoomId(props.roomId);
      navigate(`/multi-game/${props.roomId}`);
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
