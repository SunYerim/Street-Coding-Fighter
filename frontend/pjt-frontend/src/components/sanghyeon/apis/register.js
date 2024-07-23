import axios from "axios";
import { useNavigate } from "react-router-dom";

const register = async function (userId, name, password1, schoolName, birth) {
  const navigate = useNavigate();

  await axios({
    method: "POST",
    url: "/user/join",
    data: {
      userId,
      name,
      password: password1,
      schoolName,
      birth,
    },
  })
    .then((response) => {
      alert("회원가입에 성공했습니다.");
      navigate("/login");
    })
    .catch((error) => {
      alert(error);
    });
};

export default register;
