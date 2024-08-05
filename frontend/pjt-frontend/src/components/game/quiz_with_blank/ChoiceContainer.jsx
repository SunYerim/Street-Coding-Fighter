const style = {
  marginTop: "20px",
  padding: "10px",
  height: "50px",
  backgroundColor: "#007BFF",
};

const ChoiceContainer = ({ children }) => {
  return <div style={style}>{children}</div>;
};

export default ChoiceContainer;
