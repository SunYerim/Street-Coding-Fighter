import "../../../css/FindPasswordPage.css";
import { useRef } from "react";
import store from "../../../store/store.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindPasswordPage = () => {
  const { userId, baseURL, code, setCode, setUserId } = store((state) => ({
    userId: state.userId,
    baseURL: state.baseURL,
    code: state.code,
    setCode: state.setCode,
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
    } catch (error) {
      console.log(error);
    }
  };

  const checkVerificationCode = async () => {
    try {
      const chkRes = await axios({
        method: "GET",
        url: `${baseURL}/user/public/request-verification`,
        data: {
          userId: currentUserId.current.value,
          code: verificationCode.current.value,
        },
      });
      isVerified.current = true;
      setUserId(currentUserId.current.value);
    } catch (error) {
      console.log(error);
    }
  };

  const completeVerification = () => {
    if (!isVerified.current) {
      alert("인증코드를 확인해주세요.");
    } else {
      setCode(verificationCode.current.value);
      navigate("/reset-password");
    }
  };

  return (
    <>
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
          <button onClick={completeVerification} className="find-password-next">
            다음
          </button>
        </div>
      </div>
    </>
  );
};

export default FindPasswordPage;
