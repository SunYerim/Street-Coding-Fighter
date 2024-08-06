import '../../../css/Header.css';
import Setting from './Setting';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

function Header() {
  const navigate = useNavigate();
  const userIcon = '/memberIcon.png';
  const settingIcon = '/settingIcon.png';
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="header-container">
        <div className="header-back-button" onClick={() => navigate('/main')}>
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
}

export default Header;
