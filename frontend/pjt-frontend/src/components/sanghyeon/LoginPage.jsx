import axios from "axios";
import { useRef } from "react";
import AccountButton from "./AccountButton.jsx";
import "../../css/LoginPage.css";

export default function LoginPage() {
  const username = useRef(null);
  const password = useRef(null);

  const logIn = function () {
    console.log("Login");
    console.log(username.current.value);
    console.log(password.current.value);

    // axios({
    //   method: "POST",
    //   url: "/user/login",
    //   data: {
    //     username: username.current.value,
    //     password: password.current.value,
    //   },
    // }).then((response) => {
    //   console.log(response);
    //   Access Token
    //   Refresh Token
    // });
  };

  return (
    <>
      <div className="login-container">
        <input type="text" ref={username} />
        <input type="password" ref={password} />
        <button onClick={logIn}>Login</button>
        <AccountButton buttonType="Sign Up" />
        <div>
          <button>Forgot username?</button>
          <button>Forgot password?</button>
        </div>
      </div>
    </>
  );
}
