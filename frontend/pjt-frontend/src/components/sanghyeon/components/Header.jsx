import "../../../css/Header.css";
import settingIcon from "../../../assets/settingIcon.png";
import userIcon from "../../../assets/userIcon.png";

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <>
      <div className="header-container">
        <h3
          className="header-title"
          onClick={() => {
            navigate("/main");
          }}
        >
          Street Coding Figther
        </h3>
        <div className="header-icon">
          <img
            onClick={() => {
              navigate("/profile");
            }}
            className="user-icon"
            src={userIcon}
            alt="userIcon"
          />
          <img
            onClick={() => {
              alert("설정 팝업창");
            }}
            className="setting-icon"
            src={settingIcon}
            alt="settingIcon"
          />
        </div>
      </div>
    </>
  );
}

export default Header;
