import { useState } from "react";
import reactStringReplace from "react-string-replace";
import Choice from "./Choice";
import Blank from "./Blank";
import ChoiceContainer from "./ChoiceContainer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import StyleToPythonCode from "../StyleToPythonCode.jsx";
const testQuizContent = {
  content:
    'def bubble_sort(arr):\n    n = len(arr)  \n    for i in range(n):  \n        for j in range(0, n - i - 1):  \n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[$blank1$], arr[$blank2$]\n\n# 테스트용 리스트\ndata = [64, 34, 25, 12, 22, 11, 90]\n\n# 정렬 함수 호출\nbubble_sort($blank3$)\nprint("정렬된 리스트:", data)',
  answer: {
    1: "j + 1",
    2: "j",
    3: "data",
  },
  choices: {
    1: "i",
    2: "i+1",
    3: "j+1",
    4: "j",
    5: "data",
    6: "print",
  },
};

const DragNDropQuiz = ({ problem }) => {
  const [blanks, setBlanks] = useState({});
  const [choices, setChoices] = useState(
    Object.values(testQuizContent.choices)
  );

  const handleDrop = (blankId, choice) => {
    setBlanks((prevBlanks) => ({
      ...prevBlanks,
      [blankId]: choice,
    }));
    console.log(blanks);
    // setChoices((prevChoices) => prevChoices.filter((item) => item !== choice));
  };

  const handleSubmit = () => {
    const isCorrect = Object.keys(testQuizContent.answer).every((key) => {
      return testQuizContent.answer[key] === blanks[key];
    });
    alert("정답 제출");
  };

  let modifiedContent = reactStringReplace(
    testQuizContent.content,
    /\$blank(\d+)\$/g,
    (match, i) => {
      return (
        <Blank key={match} id={match} onDrop={handleDrop}>
          {blanks[match]}
        </Blank>
      );
    }
  );

  // modifiedContent = reactStringReplace(
  //   modifiedContent,
  //   /(def|for|if|else|return|import|from|as|class|try|except|finally|with|yield|raise|assert|del|pass|continue|break)\b/g,
  //   (match, i) => {
  //     return <span className="keyword">{match}</span>;
  //   }
  // );
  // modifiedContent = reactStringReplace(modifiedContent, /('.*?'|".*?")/g, (match, i) => {
  //   return <span className="string">{match}</span>;
  // });
  // modifiedContent = reactStringReplace(modifiedContent, /(#.*)/g, (match, i) => {
  //   return <span className="comment">{match}</span>;
  // });
  // modifiedContent = reactStringReplace(modifiedContent, /(\b\d+\b)/g, (match, i) => {
  //   return <span className="number">{match}</span>;
  // });

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

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          <StyleToPythonCode codeString={modifiedContent} />
        </div>

        <ChoiceContainer>
          {choices.map((choice, idx) => {
            return <Choice key={`choice-${idx}`} choice={choice} />;
          })}
        </ChoiceContainer>
        <button
          style={styles.submitButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.submitButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.submitButton.backgroundColor)
          }
          onClick={handleSubmit}
        >
          제출
        </button>
      </DndProvider>
    </>
  );
};

export default DragNDropQuiz;
