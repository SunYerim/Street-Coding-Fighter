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

  const styles = {
    blank: {
      display: 'inline-block',
      width: isOver ? '60px' : '50px',
      height: '1.3em',
      backgroundColor: isOver ? 'lightblue' : 'white',
      border: '1px solid black',
      margin: '0 2px',
      padding: '3px',
      color: 'black',
      textAlign: 'center',
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
