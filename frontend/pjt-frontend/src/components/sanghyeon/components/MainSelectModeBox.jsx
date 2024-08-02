import "../../../css/MainSelectModeBox.css";
import { useNavigate } from "react-router-dom";

function MainSelectModeBox(props) {
  const { mode } = props;
  const navigate = useNavigate();

  const selectMode = function (mode) {
    if (mode === "싱글플레이") {
      navigate("/single-main");
    } else if (mode === "멀티플레이") {
      navigate("/multi");
    } else if (mode === "1 vs 1") {
      navigate("/battle-list");
    } else if (mode === "랭킹") {
      alert(`${mode}`);
    }
  };

  return (
    <>
      <div onClick={() => selectMode(mode)} className="select-box">
        <h1 className="mode">{mode}</h1>
      </div>
    </>
  );
}

export default MainSelectModeBox;
