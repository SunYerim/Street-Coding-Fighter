import { useRef, useState } from "react";
import "../../../css/SignUpPage.css";
import register from "../apis/register.js";
import Modal from "react-modal";
import warningSign from "../../../assets/warningSign.png";

function SignUpPage() {
  const userId = useRef(null);
  const name = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const schoolName = useRef(null);
  const birth = useRef(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const isValid = function (pw1, pw2) {
    if (pw1 !== pw2) {
      return false;
    } else {
      return true;
    }
  };

  // id 중복 확인
  // pw1, pw2 비밀번호 일치 확인

  const signUp = function () {
    if (!isValid(password1.current.value, password2.current.value)) {
      openModal();
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
      <div className="signup-outer-container">
        <h1 className="signup-title">SIGN UP</h1>
        <div className="signup-container">
          <input type="text" ref={userId} placeholder="아이디" />
          <input type="text" ref={name} placeholder="닉네임" />
          <input type="password" ref={password1} placeholder="비밀번호" />
          <input type="password" ref={password2} placeholder="비밀번호 확인" />
          <input type="text" ref={schoolName} placeholder="학교" />
          <input type="text" ref={birth} placeholder="생일" />
          <button onClick={signUp}>CREATE</button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Alert Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-container">
          <img className="warning-img" src={warningSign} alt="warning-sign" />
          <h4 className="warning-text">비밀번호가 일치하지 않습니다 !</h4>
        </div>
      </Modal>
    </>
  );
}

export default SignUpPage;
