import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MultiMain from "./components/MultiMain.jsx";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MultiMain />} />
        </Routes>
      </Router>
  );
}

export default App;
