import axios from "axios";
import { useRef } from "react";
import AccountButton from "../components/AccountButton.jsx";
import "../../../css/LoginPage.css";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";
import { Howl } from 'howler';

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
  const startSound = new Howl({
    src: ['/startSound.mp3'],
    loop: false,
    volume: 0.5,
  });
  const noAuthLogin = async () => {
    startSound.play();
    try {
      const res = await axios({
        method: "POST",
        url: `${baseURL}/user/login`,
        data: {
          userId: userId.current.value,
          password: password.current.value,
        },
      });

      const authorizationHeader = res.headers["authorization"];
      const accessToken = authorizationHeader
        ? authorizationHeader.replace(/^Bearer\s+/i, "")
        : null;

      const memberID = res.data["memberId"];

      setAccessToken(accessToken);
      setMemberId(memberID);
      navigate("/main");
      // if (accessToken && memberID) {
      //   try {
      //     const infoRes = await axios({
      //       method: "GET",
      //       url: `${baseURL}/user/${memberID}`,
      //       headers: {
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     });

      //     const { userId, name, schoolName, birth } = infoRes.data;

      //     if (userId && name && schoolName && birth) {
      //       setUserId(userId);
      //       setName(name);
      //       setSchoolName(schoolName);
      //       setBirth(birth);

      //       navigate("/main");
      //     } else {
      //       alert("로그인 실패");
      //     }
      //   } catch (error) {
      //     alert("로그인 실패");
      //   }
      // } else {
      //   alert("로그인 실패");
      // }
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
            <div className="find-password" onClick={() => alert("미구현")}>
              비밀번호 찾기...
            </div>
            <div className="find-password" onClick={() => alert("미구현")}>
              카카오로 시작하기
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
