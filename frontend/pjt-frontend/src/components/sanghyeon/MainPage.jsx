import MainSelectModeBox from "./MainSelectModeBox";
import "../../css/MainPage.css";

export default function MainPage() {
  return (
    <>
      <div className="mode-container">
        <button>
          <MainSelectModeBox />
        </button>
        <button>
          <MainSelectModeBox />
        </button>
        <button>
          <MainSelectModeBox />
        </button>
      </div>
    </>
  );
}
