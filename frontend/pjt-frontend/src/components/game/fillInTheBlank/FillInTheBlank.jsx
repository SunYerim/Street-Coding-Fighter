import { useState, useEffect } from "react";
import reactStringReplace from "react-string-replace";
import Choice from "./Choice";
import Blank from "./Blank";
import ChoiceContainer from "./ChoiceContainer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import StyleToPythonCode from "../StyleToPythonCode.jsx";
import multiStore from "../../../stores/multiStore.jsx";
import "../../../css/MultiGame.css";

const FillInTheBlank = ({ problem }) => {
  const [blanks, setBlanks] = useState({});
  const [choices, setChoices] = useState([]);
  const [choiceMap, setChoiceMap] = useState({}); // choiceId와 choiceText의 매핑
  const [modifiedContent, setModifiedContent] = useState(""); // modifiedContent 상태를 추가
  const [problemData, setProblemData] = useState(problem);

  const { blankSolve, setBlankSolve } = multiStore((state) => ({
    blankSolve: state.blankSolve,
    setBlankSolve: state.setBlankSolve,
  }));

  // useEffect(() => {
  //   const problemData = problem;
  //   setProblem(problemData);
  // }, [myBlankProblem]);

  useEffect(() => {
    if (problemData && problemData.problemChoices) {
      // problem.problemChoices 배열에서 choiceText와 choiceId를 매핑합니다.
      const choiceTexts = problemData.problemChoices.map(
        (choice) => choice.choiceText
      );
      const choiceMap = problemData.problemChoices.reduce((acc, choice) => {
        acc[choice.choiceText] = choice.choiceId;
        return acc;
      }, {});
      setChoices(choiceTexts);
      setChoiceMap(choiceMap);

      // 각 블랭크에 대한 초기화
      const initialBlanks = {};
      for (let i = 1; i <= problemData.problemContent.numberOfBlank; i++) {
        initialBlanks[i] = "ssafy"; // 각 블랭크의 초기값을 null로 설정
      }
      setBlanks(initialBlanks);
    }
  }, [problemData]);

  useEffect(() => {
    if (Object.keys(blanks).length > 0) {
      setBlankSolve(blanks);
    }
  }, [blanks]);

  useEffect(() => {
    if (problemData && problemData.problemContent && problemData.problemContent.content) {
      const problemContent = problemData.problemContent.content;

      const newModifiedContent = reactStringReplace(
        problemContent,
        /\$blank(\d+)\$/g,
        (match, i) => {
          return (
            <Blank key={match} id={match} onDrop={handleDrop}>
              {blanks[match]
                ? choices.find(
                    (choice) =>
                      choice ===
                      Object.keys(choiceMap).find(
                        (key) => choiceMap[key] === blanks[match]
                      )
                  )
                : ""}
            </Blank>
          );
        }
      );

      setModifiedContent(newModifiedContent);
    } else {
      setModifiedContent(""); // problemContent가 없으면 빈 문자열로 설정
    }
  }, [problemData, blanks, choices, choiceMap]); // problemContent와 관련된 의존성 배열 업데이트

  const handleDrop = (blankId, choiceText) => {
    const choiceId = choiceMap[choiceText];
    setBlanks((prevBlanks) => ({
      ...prevBlanks,
      [blankId]: choiceId,
    }));
  };

  const styles = {
    quizContainer: {
      marginBottom: "20px",
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
    submitButtonHover: {
      backgroundColor: "#0056b3",
    },
  };

  const handleSubmit = () => {
    onFillBlank();
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          {modifiedContent && (
            <StyleToPythonCode codeString={modifiedContent} />
          )}
        </div>

        <ChoiceContainer>
          {choices.map((choice, idx) => {
            return <Choice key={`choice-${idx}`} choice={choice} />;
          })}
        </ChoiceContainer>
      </DndProvider>
      <button className='multi-button' onClick={handleSubmit}>제출</button>
    </>
  );
};

export default FillInTheBlank;
