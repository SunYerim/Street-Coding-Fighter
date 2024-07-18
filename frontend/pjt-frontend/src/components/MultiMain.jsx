import "../index.css";
import "../css/MultiMain.css";

import { useNavigate } from "react-router-dom";

export default function TitlePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="multi-container">
          <div className="multi-list">

          </div>
        </div>
      </div>
    </>
  );
}
