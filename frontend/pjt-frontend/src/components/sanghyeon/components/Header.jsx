import "../../../css/Header.css";
import memberIcon from "../../../../public/memberIcon.png";
import Setting from "./Setting";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const userIcon = "userIcon.png";
  return (
    <>
      <div className="header-container">
        <button className="header-back-button" onClick={() => navigate(-1)}>
          뒤로 가기 (임시)
        </button>
        <h2
          className="header-title"
          onClick={() => {
            navigate("/main");
          }}
        >
          Street Coding Figther
        </h2>
        <div className="header-icon">
          <img
            onClick={() => {
              navigate("/profile");
            }}
            className="user-icon"
            src={memberIcon}
            alt="memberIcon"
          />
          <Setting />
        </div>
      </div>
    </>
  );
}

export default Header;
