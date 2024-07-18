import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TitlePage from "./components/sanghyeon/TitlePage.jsx";
import LoginPage from "./components/sanghyeon/LoginPage.jsx";
import SignUpPage from "./components/sanghyeon/SignUpPage.jsx";
import MainPage from "./components/sanghyeon/MainPage.jsx";
import ProfilePage from "./components/sanghyeon2/ProfilePage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/record" element={<RecordPage />} />
        <Route path="/report" element={<ReportPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
