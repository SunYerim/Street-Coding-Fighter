import '../../../css/Header.css';
import Setting from './Setting';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import store from "../../../store/store.js";


const Header = ({ type = "default" }) => {
  const navigate = useNavigate();
  const userIcon = '/memberIcon.png';
  const settingIcon = '/settingIcon.png';
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  const userIcon = "/memberIcon.png";
  const { baseURL, accessToken, roomId, setNormalQuit } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    roomId: state.roomId,
    setNormalQuit: state.setNormalQuit,
  }));

  const quitBattleRoom = async () => {
    try {
      const checkQuit = confirm("방을 나가시겠습니까?");

      if (!checkQuit) return;

      const quitRes = await axios({
        method: "POST",
        url: `${baseURL}/battle/room/${roomId}/leave`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNormalQuit(true);
      alert("방 나가기에 성공했습니다.");
      navigate("/battle-list");
    } catch (error) {
      alert("방 나가기에 실패했습니다.");
      console.log(error);
    }
  };

  return (
    <>
      <div className="header-container">
        <div className="header-back-button" onClick={type === "Game" ? quitBattleRoom : () => navigate('/main')}>
        <MdOutlineKeyboardBackspace />
        </div>
        <h2
          className="header-title"
          onClick={() => {
            navigate('/main');
          }}
        >
          Street Coding Figther
        </h2>
        <div className="header-icon">
          <img
            onClick={() => {
              navigate('/profile');
            }}
            className="user-icon"
            src={userIcon}
            alt="memberIcon"
          />
          <img onClick={openModal} className="setting-icon" src={settingIcon} alt="settingIcon" />
        </div>
      </div>
      <Setting isOpen={modalIsOpen} onClose={closeModal} />
    </>
  );
};
}
export default Header;
