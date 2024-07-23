import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../../css/Setting.css";
import settingIcon from "../../../assets/settingIcon.png";
import close from "../../../assets/close.png";

Modal.setAppElement("#root");

const Setting = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <img
        onClick={openModal}
        className="setting-icon"
        src={settingIcon}
        alt="settingIcon"
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="setting-container">
          <div className="setting-title">
            <h2>Setting</h2>
            <img
              className="setting-close"
              onClick={closeModal}
              src={close}
              alt="close-setting"
            />
          </div>
          <hr />
          <div className="settings">
            <p className="setting">Effect Volume</p>
            <p className="setting">Background Volume</p>
            <p className="setting" onClick={() => navigate("/")}>
              Back to Title
            </p>
            <p className="setting">Logout</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Setting;
