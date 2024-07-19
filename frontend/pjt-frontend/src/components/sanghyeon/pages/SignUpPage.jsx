// import axios from "axios";
import { useRef } from "react";
import "../../../css/SignUpPage.css";
import register from "../apis/register.js";

function SignUpPage() {
  const userId = useRef(null);
  const name = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const schoolName = useRef(null);
  const birth = useRef(null);

  const signUp = function () {
    if (password1.current.value !== password2.current.value) {
      alert("passwords do not match");
    } else {
      register(
        userId.current.value,
        name.current.value,
        password1.current.value,
        schoolName.current.value,
        birth.current.value
      );
    }
  };

  return (
    <>
      <div className="signup-container">
        <input type="text" ref={userId} />
        <input type="text" ref={name} />
        <input type="password" ref={password1} />
        <input type="password" ref={password2} />
        <input type="text" ref={schoolName} />
        <input type="text" ref={birth} />
        <button onClick={signUp}>CREATE</button>
      </div>
    </>
  );
}

export default SignUpPage;
