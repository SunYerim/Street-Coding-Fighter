import {
  borderRadius,
  fontSize,
  height,
  minWidth,
  padding,
  style,
} from "@mui/system";
import StyleToPythonCode from "../StyleToPythonCode";
import "../../../css/MultiGame.css";
import { useState, useEffect } from "react";
import store from "../../store/store";

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
  const [problem, setProblem] = useState(null); // 문제 데이터를 저장할 상태 추가
  const [modifiedContent, setModifiedContent] = useState(""); // modifiedContent 상태를 추가

  const { shortAnswerSolve, setShortAnswerSolve, myShortAnswerProblem } = store(
    (state) => ({
      shortAnswerSolve: state.shortAnswerSolve,
      setShortAnswerSolve: state.setShortAnswerSolve,
      myShortAnswerProblem: state.myShortAnswerProblem,
    })
  );

  useEffect(() => {
    // store에서 문제 데이터를 가져오는 함수 호출
    const problemData = myShortAnswerProblem; // 또는 store.getState().problem과 같은 방식으로 직접 접근할 수 있음
    setProblem(problemData);
  }, [myShortAnswerProblem]);

  useEffect(() => {
    if (problem && problem.problemContent && problem.problemContent.content) {
      setModifiedContent(problem.problemContent.content);
    } else {
      setModifiedContent(""); // problemContent가 없으면 빈 문자열로 설정
    }
  }, [problem]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    setShortAnswerSolve(value); // 입력값을 로컬 저장소에 저장
  };

  return (
    <>
      <h2>주관식 문제</h2>
      <div className="multi-game-playing">
        <div style={styles.codeContainer}>
          <StyleToPythonCode codeString={modifiedContent} />
        </div>
        <div style={styles.inputDiv}>
          <input
            style={styles.answerInput}
            type="text"
            value={answer}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default ShortAnswer;
