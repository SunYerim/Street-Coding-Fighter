import { useRef } from "react";
import AccountButton from "../components/AccountButton.jsx";
import "../../../css/LoginPage.css";
import noAuthLogin from "../apis/noAuthLogin.js";

function LoginPage() {
  const userId = useRef(null);
  const password = useRef(null);

  const logIn = function () {
    noAuthLogin(userId.current.value, password.current.value);
  };

  return (
    <>
      <div className="login-outer-container">
        <div className="login-title">Login Page</div>
        <div className="login-container">
          <input type="text" ref={userId} placeholder="아이디" />
          <input type="password" ref={password} placeholder="비밀번호" />
          <button onClick={logIn}>Login</button>
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
