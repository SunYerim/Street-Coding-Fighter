import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../../css/Setting.css";
import settingIcon from "../../../assets/settingIcon.png";
import close from "../../../assets/close.png";
import axios from "axios";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";

Modal.setAppElement("#root");

const Setting = () => {
  const { accessToken, setAccessToken, baseURL, memberId, setMemberId } = store(
    (state) => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      baseURL: state.baseURL,
      memberId: state.memberId,
      setMemberId: state.setMemberId,
    })
  );
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const logout = async () => {
    try {
      const logoutRes = await authClient({
        method: "POST",
        url: `${baseURL}/user/logout/${memberId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAccessToken(null);
      setMemberId(null);
      alert("로그아웃에 성공했습니다.");
      navigate("/login");
    } catch (error) {
      alert("로그아웃에 실패했습니다.");
    }
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
            <p onClick={logout} className="setting">
              Logout
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Setting;
