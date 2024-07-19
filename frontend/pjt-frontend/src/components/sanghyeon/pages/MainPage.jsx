import Header from "../components/Header";
import MainSelectModeBox from "../components/MainSelectModeBox";
import "../../../css/MainPage.css";

import Container from "../components/Container";

function MainPage() {
  return (
    <>
      <Header />
      <div className="mode-container">
        <MainSelectModeBox mode="싱글플레이" />
        <MainSelectModeBox mode="멀티플레이" />
        <MainSelectModeBox mode="1 vs 1" />
      </div>
    </>
  );
}

export default MainPage;
