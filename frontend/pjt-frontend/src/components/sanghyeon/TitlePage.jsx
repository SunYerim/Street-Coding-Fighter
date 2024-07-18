import "../../index.css";
import "../../css/TitlePage.css";

import { useNavigate } from "react-router-dom";

export default function TitlePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="title-container">
        <h1 className="title">Street Codding</h1>
        <h1 className="title">Figther</h1>
      </div>
      <div className="button-container">
        <button className="start-button" onClick={() => navigate("/login")}>
          Start!
        </button>
      </div>
    </>
  );
}
