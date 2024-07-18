import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TitlePage from "./components/sanghyeon/TitlePage.jsx";
import LoginPage from "./components/sanghyeon/LoginPage.jsx";
import SignUpPage from "./components/sanghyeon/SignUpPage.jsx";
import MainPage from "./components/sanghyeon/MainPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/sdsd" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
