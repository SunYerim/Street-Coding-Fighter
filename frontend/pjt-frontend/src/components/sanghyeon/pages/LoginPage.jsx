import axios from "axios";
import { useRef } from "react";
import AccountButton from "../components/AccountButton.jsx";
import "../../../css/LoginPage.css";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { setUserId, setName } = store();
  const userId = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();

  const noAuthLogin = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:8080/user/login",
        data: {
          userId: userId.current.value,
          password: password.current.value,
        },
      });
      const accessToken = res.headers.Authorization;
      console.log(accessToken);
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
          <input type="text" ref={userId} placeholder="아이디" />
          <input type="password" ref={password} placeholder="비밀번호" />
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
}

export default LoginPage;
