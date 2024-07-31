import { useDrop } from 'react-dnd';

const Blank = ({ id, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'CHOICE',
    drop: (item) => {
      onDrop(id, item.choice);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // 색깔 결정 로직
  let backgroundColor;
  if (isOver) {
    backgroundColor = 'lightblue'; // 빈칸이 채워졌을 때
  } else if (children) {
    backgroundColor = 'lightgreen'; // isOver일 때
  } else {
    backgroundColor = 'white'; // 기본 색깔
  }
  let width, height;
  if (isOver) {
    width = '60px';
    height = '2em';
  } else if (children) {
    width = '50px';
    height = '1.5em';
  } else {
    width = '50px';
    height = '1.5em';
  }
  const styles = {
    blank: {
      display: 'inline-block',
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      border: '1px solid black',
      margin: '0 2px',
      padding: '3px',
      color: 'black',
      textAlign: 'center',
      alignContent : 'center',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <span ref={drop} style={styles.blank}>
      {children || '_____'}
    </span>
  );
};

export default Blank;
