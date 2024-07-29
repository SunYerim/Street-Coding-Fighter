import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TitlePage from "./components/sanghyeon/pages/TitlePage.jsx";
import LoginPage from "./components/sanghyeon/pages/LoginPage.jsx";
import SignUpPage from "./components/sanghyeon/pages/SignUpPage.jsx";
import MainPage from "./components/sanghyeon/pages/MainPage.jsx";
import ProfilePage from "./components/sanghyeon/pages/ProfilePage.jsx";
import RecordPage from "./components/sanghyeon/pages/RecordPage.jsx";
import ReportPage from "./components/sanghyeon/pages/ReportPage.jsx";
import SolvedPage from "./components/sanghyeon/pages/SolvedPage.jsx";
import SingleMain from "./components/single/SingleMain.jsx";
import SinglePlay from "./components/single/single-play/SinglePlay.jsx";
import MultiMain from "./components/multi/MultiMain.jsx";
import MultiCreate from "./components/multi/MultiCreate.jsx";
import BattleCreate from "./components/battle/BattleCreate.jsx";
import BattleMain from "./components/battle/BattleMain.jsx";
import MultiGame from "./components/multi/MultiGame.jsx";
import MultiGame_flex from "./components/multi/MultiGame_flex.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/solved" element={<SolvedPage />} />
          <Route path="/single" element={<SingleMain />} />
          <Route path="/single/main" element={<SinglePlay />} />
          <Route path="/multi" element={<MultiMain />} />
          <Route path="/multi-create" element={<MultiCreate />} />
          <Route path="/battle" element={<BattleMain />} />
          <Route path="/battle-create" element={<BattleCreate />} />
          <Route path="/multi-game" element={<MultiGame />} />
          <Route path="/multi-game-flex" element={<MultiGame_flex />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
