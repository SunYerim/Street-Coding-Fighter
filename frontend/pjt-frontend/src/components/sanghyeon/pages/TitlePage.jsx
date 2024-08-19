import '../../../index.css';
import '../../../css/TitlePage.css';
import TitleLogo from '../components/TitleLogo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SoundStore from '../../../stores/SoundStore';
import FloatingButton from '../../buttons/FloatingButton.jsx';

import Setting from '../../sanghyeon/components/Setting.jsx';
import { MdGpsFixed } from 'react-icons/md';
function TitlePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { playEffectSound } = SoundStore();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const settingIcon = '/settingIcon.png';

  const handleClick = () => {
    navigate('/login');
    console.log('play click');
    playEffectSound('btnClickSound');
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="title-container">
        <img style={style.setting} onClick={openModal} className="setting-icon" src={settingIcon} alt="settingIcon" />
        <Setting isOpen={modalIsOpen} onClose={closeModal} />

        <TitleLogo />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 2 }}
        className={`start-button-container ${isVisible ? 'visible' : ''}`}
        onAnimationComplete={() => setIsVisible(true)}
      >
        <FloatingButton disabled={!isVisible} onClick={handleClick}>
          START
        </FloatingButton>
      </motion.div>
    </>
  );
}
const style = {
  setting : {
    position : 'fixed',
    top : '20px',
    right : '30px',
  }
}
export default TitlePage;
