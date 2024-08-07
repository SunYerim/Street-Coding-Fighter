import { useState, useEffect } from "react";
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
  choiceContainer: {
    width: "40vw",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    justifyContent: "center",
    margin: "0 auto",
  },
  choiceButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px 0",
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
    marginTop: "20px",
  },
};

const MultipleChoice = () => {
  const [problem, setProblem] = useState(null); // 문제 데이터를 저장할 상태 추가
  const [modifiedContent, setModifiedContent] = useState(""); // modifiedContent 상태를 추가
  const [selectedChoice, setSelectedChoice] = useState(null); // 선택된 choiceId를 저장할 상태 추가

  const {
    multipleChoiceSolve,
    setMultipleChoiceSolve,
    myMultipleChoiceProblem,
  } = store((state) => ({
    multipleChoiceSolve: state.multipleChoiceSolve,
    setMultipleChoiceSolve: state.setMultipleChoiceSolve,
    myMultipleChoiceProblem: state.myMultipleChoiceProblem,
  }));

  useEffect(() => {
    // store에서 문제 데이터를 가져오는 함수 호출
    const problemData = myMultipleChoiceProblem; // 또는 store.getState().problem과 같은 방식으로 직접 접근할 수 있음
    setProblem(problemData);
  }, [myMultipleChoiceProblem]);

  useEffect(() => {
    if (problem && problem.problemContent && problem.problemContent.content) {
      const problemContent = problem.problemContent.content;
      const newModifiedContent = reactStringReplace(
        problemContent,
        /\$blank(\d+)\$/g,
        (match, i) => (
          <span key={match}>
            <input
              style={styles.answerInput}
              type="text"
              value={selectedChoice === match ? multipleChoiceSolve : ""}
              onChange={(e) => handleChoiceSelect(match, e.target.value)}
            />
          </span>
        )
      );
      setModifiedContent(newModifiedContent);
    } else {
      setModifiedContent(""); // problemContent가 없으면 빈 문자열로 설정
    }
  }, [problem]);

  useEffect(() => {
    setSelectedChoice(multipleChoiceSolve); // 로컬 저장소의 값을 컴포넌트 상태에 반영
  }, [multipleChoiceSolve]);

  const handleChoiceSelect = (choiceId) => {
    setSelectedChoice(choiceId); // 선택된 choiceId를 상태에 저장
    setMultipleChoiceSolve(choiceId); // 선택된 값을 로컬 저장소에 저장
  };

  return (
    <>
      <div className="multi-game-playing">
        <div style={styles.codeContainer}>
          {modifiedContent && (
            <StyleToPythonCode codeString={modifiedContent} />
          )}
        </div>
        <div style={styles.choiceContainer}>
          {problem &&
            problem.problemChoices &&
            problem.problemChoices.map((choice, index) => (
              <button
                key={choice.choiceId}
                style={{
                  ...styles.choiceButton,
                  backgroundColor:
                    selectedChoice === choice.choiceId ? "#0056b3" : "#007bff",
                }}
                onClick={() => handleChoiceSelect(choice.choiceId)}
              >
                {index + 1}. {choice.choiceText}
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default MultipleChoice;
