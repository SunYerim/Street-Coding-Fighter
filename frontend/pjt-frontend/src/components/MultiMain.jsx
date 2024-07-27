import "../index.css";
import "../css/MultiMain.css";
import Button from "./Button.jsx";

import { useNavigate } from "react-router-dom";

export default function TitlePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="multi-container">
          <div className="multi-list">

          </div>
          <div className="button-container">
            <div className="multi-button">

            </div>
            <div className="multi-button">

            </div>
            <div className="multi-button">

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
