import { useState, useRef } from "react";
import reactStringReplace from "react-string-replace";
import StyleToPythonCode from "../StyleToPythonCode";
import "../../../css/MultiGame.css";
import store from "../../../store/store.js";

const styles = {
  codeContainer: {
    width: "40vw",
    height: "60%",
    margin: "0 auto",
    padding: "1rem",
    borderRadius: "5px",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
  },
  answerInput: {
    width: "20vw",
    height: "20%",
    padding: "10px",
    paddingLeft: "20px",
    fontSize: "1.5rem",
    margin: "5% 0",
  },
  inputDiv: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "10px",
    borderRadius: "5px",
  },
  submitButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    // marginTop: '20px',
    marginLeft: "20px",
  },
};

const ShortAnswer = () => {
  const answerRef = useRef(""); // 입력값을 저장할 상태 추가
  const { shortAnswerSolve, setShortAnswerSolve, myShortAnswerProblem } = store(
    (state) => ({
      shortAnswerSolve: state.shortAnswerSolve,
      setShortAnswerSolve: state.setShortAnswerSolve,
      myShortAnswerProblem: state.myShortAnswerProblem,
    })
  );

  const problemContent = myShortAnswerProblem?.problemContent?.content;

  const modifiedContent = reactStringReplace(
    problemContent,
    /\$blank(\d+)\$/g,
    (match, i) => (
      <span key={match}>
        <input
          style={styles.answerInput}
          type="text"
          onChange={(e) => handleInputChange(e)}
        />
      </span>
    )
  );
  const handleInputChange = () => {
    answerRef.current = e.target.value;
    setShortAnswerSolve(answerRef.current === "" ? "ssafy" : answerRef.current);
  };

  return (
    <>
      <h2>주관식 문제</h2>
      <div className="multi-game-playing">
        <div style={styles.codeContainer}>
          {modifiedContent && (
            <StyleToPythonCode codeString={modifiedContent} />
          )}
        </div>
        <div style={styles.inputDiv}>
          <input
            style={styles.answerInput}
            type="text"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default ShortAnswer;
