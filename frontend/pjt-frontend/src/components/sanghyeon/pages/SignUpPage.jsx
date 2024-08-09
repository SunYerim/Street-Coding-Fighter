import axios from "axios";
import { useRef, useState } from "react";
import "../../../css/SignUpPage.css";
import { useNavigate } from "react-router-dom";
import store from "../../../store/store.js";
import Swal from "sweetalert2";

const SignUpPage = () => {
  const { baseURL, registerInfo, setRegisterInfo } = store((state) => ({
    baseURL: state.baseURL,
    registerInfo: state.registerInfo,
    setRegisterInfo: state.setRegisterInfo,
  }));

  const userId = useRef(null);
  const name = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const email = useRef(null);
  const schoolName = useRef(null);
  const birth = useRef(null);
  const navigate = useNavigate();
  const idCheckComplete = useRef(false);

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const signUp = async (event) => {
    event.preventDefault();

    if (userId.current.value.length < 3 || userId.current.value.length > 15) {
      Swal.fire({
        text: "아이디는 3글자 이상 15글자 미만으로 입력해주세요.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (!idCheckComplete.current) {
      Swal.fire({
        text: "아이디 중복 확인 을 해주세요.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (password1.current.value !== password2.current.value) {
      Swal.fire({
        text: "비밀번호가 일치하지 않습니다.",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    if (passwordRegex.test(password1.current.value) === false) {
      Swal.fire({
        text: "비밀번호는 숫자+영문자+특수문자 조합으로 8자리 이상 25자리 이하로 입력해주세요!",
        icon: "warning",
        timer: 3000,
      });
      return;
    }

    setRegisterInfo({
      userId: userId.current.value,
      name: name.current.value,
      password: password1.current.value,
      email: email.current.value,
      schoolName: schoolName.current.value,
      birth: birth.current.value,
      characterType: "",
    });
    navigate("/signup-character");
  };

  const idCheck = async () => {
    try {
      const idCheckRes = await axios({
        method: "GET",
        url: `${baseURL}/user/public/validate/${userId.current.value}`,
      });

      Swal.fire({
        text: "사용 가능한 아이디입니다.",
        icon: "success",
        timer: 3000,
      });
      idCheckComplete.current = true;
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          text: "이미 사용 중인 아이디입니다.",
          icon: "error",
          timer: 3000,
        });
      } else {
        console.log(error.response);
        Swal.fire({
          text: "알 수 없는 오류가 발생했습니다.",
          icon: "error",
          timer: 3000,
        });
      }
    }
  };

  return (
    <>
      <div className="signup-outer-container">
        <h1 className="signup-title">SIGN UP</h1>
        <form className="signup-container" onSubmit={signUp}>
          <div className="signup-userId">
            <input type="text" ref={userId} placeholder="아이디" required />
            <div onClick={idCheck} className="duplicate-chk">
              중복 확인
            </div>
          </div>
          <input type="text" ref={name} placeholder="닉네임" required />
          <input
            type="password"
            ref={password1}
            placeholder="비밀번호"
            required
          />
          <input
            type="password"
            ref={password2}
            placeholder="비밀번호 확인"
            required
          />
          <input type="email" ref={email} placeholder="이메일 주소" required />
          <input type="text" ref={schoolName} placeholder="학교" required />
          <input
            type="date"
            ref={birth}
            placeholder="생일"
            className="custom-date-input"
            required
          />
          <button type="submit">NEXT</button>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
