const style = {
  gap: "10px",
  margin: "0 auto",
  display: "inline-block",
  padding: "10px 10px",
  fontFamily: "'Fira Code', Consolas, 'Courier New', Courier, monospace",
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "white",
  border: "1px solid white",
  borderRadius: "5px",
  letterSpacing: "1px",
  textAlign: "center",
};

const ChoiceContainer = ({ children }) => {
  return <div style={style}>{children}</div>;
};

export default ChoiceContainer;
