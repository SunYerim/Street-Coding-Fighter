import axios from "axios";
import { useRef, useState } from "react";
import "../../../css/SignUpPage.css";
import Modal from "react-modal";
import warningSign from "../../../assets/warningSign.png";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const userId = useRef(null);
  const name = useRef(null);
  const password1 = useRef(null);
  const password2 = useRef(null);
  const schoolName = useRef(null);
  const birth = useRef(null);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] =
    useState("비밀번호가 일치하지 않습니다.");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const idValidation = function (userId) {
    axios({
      method: "GET",
      url: `/user/validate/${userId}`,
      data: {
        userId,
      },
    })
      .then((response) => {
        if (response.data) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        return false;
      });
  };

  const signUp = async function () {
    if (!isValid(password1.current.value, password2.current.value)) {
      openModal();
    } else {
      try {
        const res = await axios({
          method: "POST",
          url: "/user/join",
          data: {
            userId: userId.current.value,
            name: name.current.value,
            password: password1.current.value,
            schoolName: schoolName.current.value,
            birth: birth.current.value,
          },
        });
        navigate("/login");
      } catch (error) {
        alert("회원가입에 실패했습니다.");
      }
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
          <h4 className="warning-text">{errorMessage}</h4>
        </div>
      </Modal>
    </>
  );
}

export default SignUpPage;
