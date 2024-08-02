import "../../../css/SolvedDetailPage.css";
import { useEffect } from "react";
import axios from "axios";
import { CodeBlock } from "react-code-blocks";

const SolvedDetailPage = () => {

  return (
    <>
      <div className="solved-problem-outer-outer-container">
        <div className="solved-problem-outer-container">
          <div className="solved-problem-title-container">
            <h2 className="solved-problem-title">객관식 문제</h2>
          </div>
          <div className="solved-problem-container">
            <div className="solved-problem-ranking-container">
              <div className="solved-problem-ranking-title">rank</div>
              <div className="solved-problem-ranking">1</div>
              <div className="solved-problem-ranking">2</div>
              <div className="solved-problem-ranking">3</div>
              <div className="solved-problem-ranking">4</div>
            </div>
            <div className="solved-problem-inner-container">
              <div className="solved-problem-problem">
                <CodeBlock
                  className="solved-problem-code"
                  text={
                    'print("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")'
                  }
                  language="python"
                  showLineNumbers={true}
                  theme="atom-one-dark"
                  customStyle={{ width: "100%" }}
                />
              </div>
              <div className="solved-problem-answer">
                <div className="solved-problem-upper-answer">
                  <button className="solved-problem-button">1. 답안</button>
                  <button className="solved-problem-button">2. 답안</button>
                </div>
                <div className="solved-problem-lower-answer">
                  <button className="solved-problem-button">3. 답안</button>
                  <button className="solved-problem-button">4. 답안</button>
                </div>
              </div>
            </div>
            <div className="solved-problem-chatting-container">
              <div className="solved-problem-chatting-title">Chatting</div>
              <div className="solved-problem-chatting">
                <div>dltkdgus482: 안녕</div>
                <div>dltkdgus482: 안녕</div>
                <div>dltkdgus482: 안녕</div>
                <div>dltkdgus482: 안녕</div>
                <div>dltkdgus482: 안녕</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolvedDetailPage;