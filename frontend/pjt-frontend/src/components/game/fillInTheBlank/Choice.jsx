import { useDrag } from 'react-dnd';

const Choice = ({ choice }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CHOICE',
    item: { choice },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const styles = {
    choice: {
      display: 'inline-block',
      width: '80px',
      height: '2em',
      alignContent: 'center',
      textAlign: 'center',
      margin: '0 5px',
      backgroundColor: isDragging ? 'gray' : 'black',
      color: 'white',
      cursor: 'move',
      opacity: isDragging ? 0.5 : 1,
      transition: 'opacity 0.3s ease',
    },
  };

  return (
    <div ref={drag} style={styles.choice}>
      {choice}
    </div>
  );
};

export default Choice;
