import axios from "axios";
import { useRef } from "react";
import "../../css/SignUpPage.css";

export default function SignUpPage() {
  const username = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const birthdate = useRef(null);

  const signUp = function () {
    console.log("signUp");
    console.log(username.current.value);
    console.log(password1.current.value);
    console.log(password2.current.value);
    console.log(birthdate.current.value);

    if (password1.current.value !== password2.current.value) {
      console.log("passwords do not match");
    } else {
      // axios({
      //   method: "POST",
      //   url: "/user/join",
      //   data: {
      //     username: username.current.value,
      //     password: password1.current.value,
      //     birthdate: birthdate.current.value,
      //   },
      // }).then((response) => {
      //   console.log(response);
      // });

      console.log("sign up successful");
    }
  };

  return (
    <>
      <div className="signup-container">
        <input type="text" ref={username} />
        <input type="password" ref={password1} />
        <input type="password" ref={password2} />
        <input type="text" ref={birthdate} />
        <button onClick={signUp}>CREATE</button>
      </div>
    </>
  );
}
