import axios from "axios";
import { useRef, useState } from "react";
import "../../../css/SignUpPage.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import store from "../../../store/store.js";

function SignUpPage() {
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

  const [errorMessage, setErrorMessage] =
    useState("비밀번호가 일치하지 않습니다.");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const signUp = async (event) => {
    event.preventDefault();

    if (!idCheckComplete.current) {
      setErrorMessage("아이디 중복 확인을 해주세요.");
      openModal();
      return;
    }

    if (password1.current.value !== password2.current.value) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      openModal();
    } else {
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
    }
  };

  const idCheck = async () => {
    try {
      const idCheckRes = await axios({
        method: "GET",
        url: `${baseURL}/user/public/validate/${userId.current.value}`,
      });

      setErrorMessage("사용 가능한 아이디입니다.");
      openModal();
      idCheckComplete.current = true;
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage("이미 사용중인 아이디입니다.");
        openModal();
      } else {
        console.log(error.response);
        setErrorMessage("아이디 중복 확인에 실패했습니다.");
        openModal();
      }
    }
  };
  const warningSign = "/warningSign.png"
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Alert Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-container">
          <img className="warning-img" src={warningSign} alt="warning-sign" />
          <h4 className="warning-text">{errorMessage}</h4>
        </div>
      </Modal>
    </>
  );
}

export default SignUpPage;
