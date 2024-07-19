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
      <div className="login-container">
        <input type="text" ref={userId} />
        <input type="password" ref={password} />
        <button onClick={logIn}>Login</button>
        <AccountButton buttonType="Sign Up" />
      </div>
    </>
  );
}

export default LoginPage;
