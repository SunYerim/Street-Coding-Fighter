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
import Ranking from "./components/ranking/Ranking.jsx";
import SelectProblem from "./components/sanghyeon/pages/SelectProblem.jsx";
import CharacterSelection from "./components/sanghyeon/pages/CharacterSelection.jsx";
import SolvedDetailPage from "./components/sanghyeon/pages/SolvedDetailPage.jsx";
import store from "./store/store.js";

function App() {
  const { accessToken } = store((state) => ({
    accessToken: state.accessToken,
  }));

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TitlePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup-character" element={<CharacterSelection />} />
          <Route
            path="/ranking"
            element={accessToken ? <Ranking /> : <LoginPage />}
          />
          <Route
            path="/main"
            element={accessToken ? <MainPage /> : <LoginPage />}
          />
          <Route
            path="/profile"
            element={accessToken ? <ProfilePage /> : <LoginPage />}
          />
          <Route
            path="/record"
            element={accessToken ? <RecordPage /> : <LoginPage />}
          />
          <Route
            path="/report"
            element={accessToken ? <ReportPage /> : <LoginPage />}
          />
          <Route
            path="/solved"
            element={accessToken ? <SolvedPage /> : <LoginPage />}
          />
          <Route
            path="/solved/:solvedId"
            element={accessToken ? <SolvedDetailPage /> : <LoginPage />}
          />
          <Route
            path="/multi"
            element={accessToken ? <MultiMain /> : <LoginPage />}
          />
          <Route
            path="/multi-create"
            element={accessToken ? <MultiCreate /> : <LoginPage />}
          />
          <Route
            path="/battle"
            element={accessToken ? <BattleMain /> : <LoginPage />}
          />
          <Route
            path="/battle-create"
            element={accessToken ? <BattleCreate /> : <LoginPage />}
          />
          <Route
            path="/multi-game"
            element={accessToken ? <MultiGame /> : <LoginPage />}
          />
          <Route
            path="/single-main"
            element={accessToken ? <SingleMain /> : <LoginPage />}
          />
          <Route
            path="/single-play"
            element={accessToken ? <SinglePlay /> : <LoginPage />}
          />
          <Route
            path="/multi-game-select"
            element={accessToken ? <SelectProblem /> : <LoginPage />}
          />
          <Route path="*" element={<TitlePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
