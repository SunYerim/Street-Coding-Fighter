const style = {
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '20px',
  padding: '10px',
  height: 'auto',
  maxWidth: '80%',
  backgroundColor: '#007BFF',
};

const ChoiceContainer = ({ children }) => {
  return <div style={style}>{children}</div>;
};

export default ChoiceContainer;
