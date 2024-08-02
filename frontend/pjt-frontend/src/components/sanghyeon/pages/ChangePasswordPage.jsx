import "../../../css/ChangePasswordPage.css";
import axios from "axios";
import { useRef } from "react";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const newPassword = useRef(null);
  const newPasswordCheck = useRef(null);
  const navigate = useNavigate();

  const { userId, baseURL } = store((state) => ({
    userId: state.userId,
    baseURL: state.baseURL,
  }));

  const changePassword = async () => {
    if (newPassword.current.value !== newPasswordCheck.current.value) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      try {
        const res = await axios({
          method: "POST",
          url: `${baseURL}/user/change-password`,
          data: {
            userId: userId,
            newPassword: newPassword.current.value,
          },
        });

        alert("비밀번호가 변경되었습니다.");
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="change-password-outer-container">
        <div className="change-password-title">비밀번호 변경</div>
        <div className="change-password-container">
          <input type="password" placeholder="새 비밀번호" ref={newPassword} />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            ref={newPasswordCheck}
          />
          <button onClick={changePassword} className="change-password-button">
            비밀번호 변경
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
