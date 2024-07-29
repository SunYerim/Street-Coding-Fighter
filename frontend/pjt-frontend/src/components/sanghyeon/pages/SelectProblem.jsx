import Header from "../components/Header";
import "../../../css/SelectProblem.css";
import clock from "../../../assets/clock.png";

const SelectProblem = () => {
  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="select-outer-container">
          <div className="select-container">
            <h2 className="select-title">
              <div className="round">Round: 2/10</div>
              <div className="time-container">
                <img className="clock" src={clock} alt="clock" />
                <div className="time">5</div>
              </div>
              <div></div>
            </h2>
            <hr />
            <div className="select-problem-container">
              <div className="select-problem-ranking"></div>
              <div className="select-problem"></div>
              <div className="select-problem-chatting"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectProblem;
