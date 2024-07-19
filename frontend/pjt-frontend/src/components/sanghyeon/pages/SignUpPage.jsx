// import axios from "axios";
import { useRef } from "react";
import "../../../css/SignUpPage.css";
import register from "../apis/register.js";

function SignUpPage() {
  const username = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const birthday = useRef(null);

  const signUp = function () {
    if (password1.current.value !== password2.current.value) {
      console.log("passwords do not match");
    } else {
      register(
        username.current.value,
        password1.current.value,
        birthday.current.value
      );
    }
  };

  return (
    <>
      <div className="signup-container">
        <input type="text" ref={username} />
        <input type="password" ref={password1} />
        <input type="password" ref={password2} />
        <input type="text" ref={birthday} />
        <button onClick={signUp}>CREATE</button>
      </div>
    </>
  );
}

export default SignUpPage;
