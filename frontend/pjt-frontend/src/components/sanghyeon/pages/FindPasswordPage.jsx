import "../../../css/FindPasswordPage.css";
import { useRef } from "react";
import store from "../../../store/store.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoginPageButton from "../../buttons/LoginPageButton.jsx";
import Header from "../components/Header";


const FindPasswordPage = () => {
  const { userId, baseURL, code, setCode, setUserId } = store((state) => ({
    userId: state.userId,
    baseURL: state.baseURL,
    code: state.code,
    setCode: state.setCode,
    setUserId: state.setUserId,
  }));
  const currentUserId = useRef(null);
  const verificationCode = useRef(null);
  const isVerified = useRef(false);
  const navigate = useNavigate();

  const sendVerificationCode = async () => {
    try {
      const sendRes = await axios({
        method: "POST",
        url: `${baseURL}/user/public/request-verification-code`,
        data: {
          userId: currentUserId.current.value,
        },
      });
      Swal.fire({
        text: "인증코드가 발송되었습니다.",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        text: "인증코드 발송에 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
      console.log(error);
    }
  };

  const checkVerificationCode = async () => {
    try {
      const chkRes = await axios({
        method: "POST",
        url: `${baseURL}/user/public/request-verification`,
        data: {
          userId: currentUserId.current.value,
          code: verificationCode.current.value,
        },
      });
      isVerified.current = true;
      setUserId(currentUserId.current.value);
      Swal.fire({
        text: "인증코드가 일치합니다.",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        text: "인증코드가 일치하지 않습니다.",
        icon: "error",
        timer: 3000,
      });
      console.log(error);
    }
  };

  const completeVerification = () => {
    if (!isVerified.current) {
      Swal.fire({
        text: "인증코드를 확인해주세요.",
        icon: "warning",
        timer: 3000,
      });
    } else {
      setCode(verificationCode.current.value);
      navigate("/reset-password");
    }
  };

  return (
    <>
    <Header />
      <div className="find-password-outer-container">
        <div className="find-password-title">
          비밀번호를 찾고자하는 아이디를 입력해주세요.
        </div>
        <div className="find-password-container">
          <div className="find-password-user-id-container">
            <input type="text" placeholder="아이디" ref={currentUserId} />
            <button onClick={sendVerificationCode}>인증코드 받기</button>
          </div>
          <div className="find-password-password-container">
            <input type="text" placeholder="인증코드" ref={verificationCode} />
            <button onClick={checkVerificationCode}>인증코드 확인</button>
          </div>
          <LoginPageButton onClick={completeVerification} className="find-password-next">
            NEXT
          </LoginPageButton>
        </div>
      </div>
    </>
  );
};

export default FindPasswordPage;
