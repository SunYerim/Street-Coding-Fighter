import axios from "axios";
import { useRef } from "react";
import AccountButton from "../components/AccountButton.jsx";
import "../../../css/LoginPage.css";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import SoundStore from "../../../stores/SoundStore.jsx";
import createAuthClient from "../apis/createAuthClient.js";

const LoginPage = () => {
  const {
    accessToken,
    setAccessToken,
    baseURL,
    memberId,
    setMemberId,
    setUserId,
    setName,
    setSchoolName,
    setBirth,
    setRefreshToken,
  } = store((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    baseURL: state.baseURL,
    memberId: state.memberId,
    setMemberId: state.setMemberId,
    setUserId: state.setUserId,
    setName: state.setName,
    setSchoolName: state.setSchoolName,
    setBirth: state.setBirth,
    setRefreshToken: state.setRefreshToken,
  }));
  const userId = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const { playStartSound } = SoundStore();

  const noAuthLogin = async () => {
    playStartSound();
    console.log(baseURL);
    try {
      const res = await axios({
        method: "POST",
        url: `${baseURL}/user/public/login`,
        data: {
          userId: userId.current.value,
          password: password.current.value,
        },
      });

      const authorizationHeader = res.headers["authorization"];
      const accessToken = authorizationHeader
        ? authorizationHeader.replace(/^Bearer\s+/i, "")
        : null;

      const memberId = res.data["memberId"];

      setAccessToken(accessToken);
      setMemberId(memberId);
      setUserId(userId.current.value);
      navigate("/main");
    } catch (error) {
      alert("로그인 실패");
    }
  };

  return (
    <>
      <div className="login-outer-container">
        <div className="login-title">Login Page</div>
        <div className="login-container">
          <input
            onKeyDown={(e) => e.key === "Enter" && noAuthLogin()}
            type="text"
            ref={userId}
            placeholder="아이디"
          />
          <input
            onKeyDown={(e) => e.key === "Enter" && noAuthLogin()}
            type="password"
            ref={password}
            placeholder="비밀번호"
          />
          <button onClick={noAuthLogin}>Login</button>
          <AccountButton buttonType="Sign Up" />
          <div className="find-and-kakao">
            <div
              className="find-password"
              onClick={() => navigate("/find-password")}
            >
              비밀번호 찾기
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
