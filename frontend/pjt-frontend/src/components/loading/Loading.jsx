import { style, textAlign, width } from '@mui/system';

const Loading = () => {
  const sampleTips = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5', 'tip6'];
  const characters = {
    1: { moving: '/characters/movingFireSlime.gif', stop: '/characters/fireSlime.png' },
    2: { moving: '/characters/movingGreenSlime.gif', stop: '/characters/greenSlime.png' },
    3: { moving: '/characters/movingIceSlime.gif', stop: '/characters/iceSlime.png' },
    4: { moving: '/characters/movingThunderSlime.gif', stop: '/characters/thunderSlime.png' },
    5: { moving: '/characters/movingNyangSlime.gif', stop: '/characters/fireSlime.png' },
  };
  const tipNum = Math.floor(Math.random() * sampleTips.length);
  const characterNum = Math.floor(Math.random() * Object.keys(characters).length);
  return (
    <div style={styles.loading}>
      <div style={styles.tip}>
        <p>알고 계셨나요?</p>
        <p>{sampleTips[tipNum]}</p>
      </div>
      <div style={styles.loadingMessage}>
        <p>Now Loading...</p>
        <img style={styles.characterContainer} src={characters[characterNum].moving} alt="character" />
      </div>
    </div>
  );
};

const styles = {
  loading: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    fontSize: '30px',
    color: 'white',
  },
  characterContainer: {
    position: 'absolutes',
    bottom: '10vh',
    width: '100px',
    overflow: 'hidden',
    margin: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMessage: {
    position: 'fixed',
    bottom: '5vh',
    right: '5vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
  },
  tip:{
    textAlign: 'center'
  }
};

export default Loading;
