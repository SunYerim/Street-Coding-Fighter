import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../../css/Setting.css'; // 이 파일은 필요 없을 수 있습니다
import axios from 'axios';
import store from '../../../store/store.js';
import createAuthClient from '../apis/createAuthClient.js';
import SoundStore from '../../../stores/SoundStore.jsx';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; //react-icons import

Modal.setAppElement('#root');
const settingIcon = '/settingIcon.png';

const styles = {
  modal: {
    width: '500px',
    height: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  settingClose: {
    width: '25px',
    height: '25px',
    cursor: 'pointer',
  },
  settingTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  settingTitleText: {
    margin: 0,
    userSelect: 'none',
  },
  setting: {
    border: 'solid 1px black',
    padding: '10px',
    userSelect: 'none',
    cursor: 'pointer',
  },
};

const Setting = () => {
  const { accessToken, setAccessToken, baseURL, memberId, setMemberId } = store((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    baseURL: state.baseURL,
    memberId: state.memberId,
    setMemberId: state.setMemberId,
  }));

  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const authClient = createAuthClient(baseURL, () => accessToken, setAccessToken);
  const { setVolume, volume } = SoundStore(); // volume 상태 추가
  
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const logout = async () => {
    try {
      await authClient({
        method: "POST",
        url: `${baseURL}/user/logout`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAccessToken(null);
      setMemberId(null);
      alert('로그아웃에 성공했습니다.');
      navigate('/login');
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
    }
  };

  const handleVolume = () => {
    if (volume > 0) {
      console.log('volume off');
      setVolume(0);
    } else {
      console.log('volume on');
      setVolume(0.3);
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
        style={{ content: styles.modal, overlay: styles.overlay }}
      >
        <div className="setting-container">
          <div style={styles.settingTitle}>
            <h2 style={styles.settingTitleText}>Setting</h2>
            <img 
              onClick={closeModal} 
              style={styles.settingClose} 
              src="/close.png" 
              alt="close-setting" 
            />
          </div>
          <hr />
          <div className="settings">
            <p style={styles.setting} onClick={handleVolume}>
              BGM Volume
            </p>
            <p style={styles.setting} onClick={handleVolume}>
              Effect Volume
            </p>
            <p style={styles.setting} onClick={() => navigate('/')}>
              Back to Title
            </p>
            <p style={styles.setting} onClick={logout}>
              Logout
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Setting;
