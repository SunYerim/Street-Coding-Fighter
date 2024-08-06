import "../../../css/Header.css";
import Setting from "./Setting";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import store from "../../../store/store.js";

const Header = ({ type = "default" }) => {
  const navigate = useNavigate();
  const userIcon = "/memberIcon.png";
  const { baseURL, accessToken, roomId, setNormalQuit } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    roomId: state.roomId,
    setNormalQuit: state.setNormalQuit,
  }));

  const quitBattleRoom = async () => {
    try {
      const checkQuit = confirm("방을 나가시겠습니까?");

      if (!checkQuit) return;

      const quitRes = await axios({
        method: "POST",
        url: `${baseURL}/battle/room/${roomId}/leave`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("방 나가기에 성공했습니다.");
      setNormalQuit(true);
      navigate("/battle-list");
    } catch (error) {
      alert("방 나가기에 실패했습니다.");
      console.log(error);
    }
  };

  return (
    <>
      <div className="header-container">
        <button
          className="header-back-button"
          onClick={type === "Game" ? quitBattleRoom : () => navigate(-1)}
        >
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
            src={userIcon}
            alt="memberIcon"
          />
          <Setting />
        </div>
      </div>
    </>
  );
};

export default Header;
