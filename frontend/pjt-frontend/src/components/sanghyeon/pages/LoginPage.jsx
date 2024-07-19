import { useRef } from "react";
import AccountButton from "../components/AccountButton.jsx";
import "../../../css/LoginPage.css";
import noAuthLogin from "../apis/noAuthLogin.js";

function LoginPage() {
  const username = useRef(null);
  const password = useRef(null);

  const logIn = function () {
    noAuthLogin(username.current.value, password.current.value);
  };

  return (
    <>
      <div className="login-container">
        <input type="text" ref={username} />
        <input type="password" ref={password} />
        <button onClick={logIn}>Login</button>
        <AccountButton buttonType="Sign Up" />
      </div>
    </>
  );
}

export default LoginPage;
