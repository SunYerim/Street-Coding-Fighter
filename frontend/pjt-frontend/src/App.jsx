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

import './App.css';
import SingleMain from './components/single/SingleMain.jsx'
import SinglePlay from './components/single/single-play/SinglePlay.jsx'
function App() {
  return (
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
      </Routes>
    </Router>
    <div id='container'>
      <SinglePlay/>
    </div>
  );
}

export default App;
