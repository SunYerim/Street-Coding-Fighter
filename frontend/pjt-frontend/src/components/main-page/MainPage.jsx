import Header from '../sanghyeon/components/Header.jsx';
import MainSelectModeBox from './MainSelectModeBox.jsx';
import { useEffect, useState } from 'react';
import createAuthClient from '../sanghyeon/apis/createAuthClient.js';
import store from '../../store/store.js';
import SoundStore from '../../stores/SoundStore.jsx';
import Swal from 'sweetalert2';
import BasicModal from '../tutorial/BasicModal.jsx';
import Toast from '../Toast.jsx';
import { textAlign } from '@mui/system';
function MainPage() {
  const { baseURL, accessToken, setAccessToken, setName, setSchoolName, setBirth, setCharacter, setExp, name } = store(
    (state) => ({
      baseURL: state.baseURL,
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      setName: state.setName,
      setSchoolName: state.setSchoolName,
      setBirth: state.setBirth,
      setCharacter: state.setCharacter,
      setExp: state.setExp,
      name: state.name,
    })
  );
  const [toast, setToast] = useState(true);
  const authClient = createAuthClient(baseURL, () => accessToken, setAccessToken);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const profileRes = await authClient({
          method: 'GET',
          url: `${baseURL}/profile`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then(() => {
            setName(profileRes.data.name);
            setSchoolName(profileRes.data.school);
            setBirth(profileRes.data.birth);
            setCharacter(profileRes.data.userCharacter.characterType);
            setExp(profileRes.data.exp);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        // Swal.fire({
        //   text: "프로필을 불러오는데 실패했습니다.",
        //   icon: "error",
        //   timer: 3000,
        // });
        console.log(error);
      }
    };

    getProfile();
  }, []);

  const { playEffectSound } = SoundStore();

  const modeDetails = {
    '배틀 모드': {
      description: '1 대 1 대결 모드입니다.\n 서로의 실력을 겨뤄보세요.',
      imageUrl: '/characters/movingFireSlime.gif',
    },
    '멀티 모드': {
      description: '여러 명이 동시에 참여할 수 있는 \n 멀티플레이 모드입니다.',
      imageUrl: '/characters/movingGreenSlime.gif',
    },
    스토리모드: {
      description: '혼자서 학습할 수 있는 스토리모드 입니다.',
      imageUrl: '/characters/movingIceSlime.gif',
    },
    랭킹: {
      description: '순위를 겨루는 랭킹 모드입니다. \n 높은 점수를 기록해보세요.',
      imageUrl: '/characters/movingThunderSlime.gif',
    },
  };

  const defaultMode = {
    description: '튜토리얼을 읽어보세요.',
    imageUrl: '/characters/movingNyanSlime.gif',
  };

  const [hoveredMode, setHoveredMode] = useState(null);

  return (
    <>
      <Header />
      {toast && <Toast style={styles.toast} setToast={setToast} text={"Street Coding Fighter는 전체화면에 최적화 되어있습니다. \n F11을 눌러 전체화면을 활성화 해 주세요."} />}
      <div style={styles.container}>
        <div style={styles.modes}>
          {Object.keys(modeDetails).map((mode) => (
            <div
              style={styles.modeItem}
              key={mode}
              onMouseEnter={() => setHoveredMode(mode)}
              onMouseLeave={() => setHoveredMode(null)}
            >
              <MainSelectModeBox
                mode={mode}
                playEffectSound={playEffectSound} // playEffectSound 전달
              />
            </div>
          ))}
        </div>
        <div style={styles.description}>
          <img
            src={hoveredMode ? modeDetails[hoveredMode].imageUrl : defaultMode.imageUrl}
            alt={hoveredMode ? hoveredMode : '기본 이미지'}
            style={styles.image}
          />
          <p>
            {hoveredMode ? modeDetails[hoveredMode].description : defaultMode.description}
            {/* hoveredMode가 null일 때만 BasicModal을 보여줌 */}
            {!hoveredMode && <BasicModal title="기본 모드" description={defaultMode.description} />}
          </p>
        </div>
      </div>
      <div style={styles.logo}></div>
    </>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(27, 26, 85, 0.8)',
    width: '80vw',
    borderRadius: '30px',
    height: '80vh',
    marginTop: '20px',
    color: 'white',
    display: 'flex',
  },
  modes: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modeItem: {
    margin: '10px 0',
  },
  description: {
    flex: 1,
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.7rem',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    borderTopRightRadius: '30px',
    borderBottomRightRadius: '30px',
  },
  image: {
    marginTop: '10px',
    maxWidth: '100%',
    borderRadius: '10px',
  },
  logo: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.7)',
  },
  toast: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width : '100%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    whiteSpace: 'pre-wrap',
    fontSize: '1.5rem',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    transition: 'opacity 0.3s ease-in-out',
  },

};

export default MainPage;
