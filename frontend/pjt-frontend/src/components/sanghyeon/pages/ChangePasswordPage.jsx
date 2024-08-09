import "../../../css/ChangePasswordPage.css";
import axios from "axios";
import { useRef } from "react";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ChangePasswordPage = () => {
  const newPassword = useRef(null);
  const newPasswordCheck = useRef(null);
  const navigate = useNavigate();

  const { userId, baseURL } = store((state) => ({
    userId: state.userId,
    baseURL: state.baseURL,
  }));

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const changePassword = async () => {
    if (passwordRegex.test(newPassword.current.value) === false) {
      Swal.fire({
        text: "비밀번호는 숫자+영문자+특수문자 조합으로 8자리 이상 25자리 이하로 입력해주세요!",
        icon: "warning",
      });
      return;
    }

    if (newPassword.current.value !== newPasswordCheck.current.value) {
      Swal.fire({
        text: "비밀번호가 일치하지 않습니다.",
        icon: "warning",
      });
      return;
    } else {
      try {
        const res = await axios({
          method: "POST",
          url: `${baseURL}/user/public/change-password`,
          data: {
            userId: userId,
            newPassword: newPassword.current.value,
          },
        });

        Swal.fire({
          text: "비밀번호가 변경되었습니다.",
          icon: "success",
        });
        navigate("/login");
      } catch (error) {
        Swal.fire({
          text: "비밀번호 변경에 실패했습니다.",
          icon: "error",
        });
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
