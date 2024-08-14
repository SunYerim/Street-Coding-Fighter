import { height, margin } from "@mui/system";
import reactStringReplace from "react-string-replace";

const styles = {
  codeWithBlanks: {
    whiteSpace: "pre-wrap",
    fontFamily: "'Fira Code', Consolas, 'Courier New', Courier, monospace", // 더 나은 가독성을 위한 폰트 추가
    fontSize: "1.2rem", // 약간 작은 폰트 크기, 가독성을 위한 적정 크기
    backgroundColor: "#282c34", // 눈에 덜 피로한 어두운 배경
    color: "#abb2bf", // 대비가 좋은 중간 밝기의 텍스트 색상
    padding: "20px",
    borderRadius: "8px", // 더 부드러운 모서리
    lineHeight: "1.6", // 조금 더 넓은 줄 간격으로 가독성 향상
    letterSpacing: "0.02em", // 약간의 자간 추가로 가독성 개선
    margin: "0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // 약간의 그림자로 텍스트를 돋보이게
  },
};

let seq = 0;
const StyleToPythonCode = ({ codeString, quizType }) => {
  const type = {
    0: "MultiChoiceQuiz",
    1: "ShortAnswer",
    2: "DragNDropQuiz",
  };
  codeString = reactStringReplace(
    codeString,
    /(def|for|if|else|return|import|from|as|class|try|except|finally|with|yield|raise|assert|del|pass|continue|break)\b/g,
    (match, i) => {
      // console.log("keyword", i, match);
      return (
        <span className="keyword" key={`keyword-${seq++}`}>
          {match}
        </span>
      );
    }
  );
  codeString = reactStringReplace(codeString, /('.*?'|".*?")/g, (match, i) => {
    // console.log("string", i, match);
    return (
      <span className="string" key={`string-${seq++}`}>
        {match}
      </span>
    );
  });
  codeString = reactStringReplace(codeString, /(#.*)/g, (match, i) => {
    // console.log("comment", i, match);
    return (
      <span className="comment" key={`comment-${seq++}`}>
        {match}
      </span>
    );
  });
  codeString = reactStringReplace(codeString, /(\b\d+\b)/g, (match, i) => {
    // console.log("number", i, match);
    return (
      <span className="number" key={`number-${seq++}`}>
        {match}
      </span>
    );
  });
  codeString = reactStringReplace(codeString, "\\n", (match, i) => {
    // console.log("number", i, match);
    return <br key={`newline-${seq++}`} />;
  });

  return (
    <pre className="code-with-blanks" style={styles.codeWithBlanks}>
      {codeString}
      <style>{`
        .code-with-blanks .keyword {
          color: #81a1c1;
          font-family: 'Courier New', Courier, monospace;
          }
        .code-with-blanks .string {
          color: #a3be8c;    
          font-family: 'Courier New', Courier, monospace;
          }
        .code-with-blanks .comment {
          color: #616e88;
          font-family: 'Courier New', Courier, monospace;
          font-style: italic; 
          }
        .code-with-blanks .number {
          color: #b48ead;
          font-family: 'Courier New', Courier, monospace;
          }
        .code-with-blanks .function {
          color: #88c0d0;
          font-family: 'Courier New', Courier, monospace;
          }
      `}</style>
    </pre>
  );
};
export default StyleToPythonCode;
