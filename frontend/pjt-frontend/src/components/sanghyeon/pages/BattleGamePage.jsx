import Header from "../components/Header";
import "../../../css/BattleGamePage.css";
import store from "../../../store/store.js";
import { CodeBlock } from "react-code-blocks";

const BattleGamePage = () => {
  const { memberId } = store((state) => ({
    memberId: state.memberId,
  }));

  return (
    <>
      <div className="battle-game-entire-container">
        <Header />
        <div className="battle-game-outer-outer-container">
          <div className="battle-game-outer-container">
            <div className="battle-game-title-container">
              <h2 className="battle-game-title">타이머</h2>
            </div>
            <div className="battle-game-container">
              <div className="battle-game-left-container">
                <div className="battle-game-left-cam"></div>
                <div className="battle-game-history-container">
                  <div className="battle-game-ranking-title">전투 기록</div>
                  <div className="battle-game-ranking">-10</div>
                  <div className="battle-game-ranking">+20</div>
                  <div className="battle-game-ranking">-5</div>
                  <div className="battle-game-ranking">-10</div>
                </div>
              </div>
              <div className="battle-game-inner-container">
                <div className="battle-game-problem">
                  <CodeBlock
                    className="battle-game-code"
                    text={
                      'print("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")\nprint("Hello World")'
                    }
                    language="python"
                    showLineNumbers={true}
                    theme="atom-one-dark"
                    customStyle={{ width: "100%" }}
                  />
                </div>
                <div className="battle-game-answer">
                  <div className="battle-game-upper-answer">
                    <button className="battle-game-button">1. 답안</button>
                    <button className="battle-game-button">2. 답안</button>
                  </div>
                  <div className="battle-game-lower-answer">
                    <button className="battle-game-button">3. 답안</button>
                    <button className="battle-game-button">4. 답안</button>
                  </div>
                </div>
              </div>
              <div className="battle-game-right-container">
                <div className="battle-game-right-cam"></div>
                <div className="battle-game-chatting-container">
                  <div className="battle-game-chatting-title">Chatting</div>
                  <div className="battle-game-chatting">
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
        </div>
      </div>
    </>
  );
};

export default BattleGamePage;
