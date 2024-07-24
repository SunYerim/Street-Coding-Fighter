import axios from "axios";

const register = function (userId, name, password1, schoolName, birth) {
  axios({
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
      return true;
    })
    .catch((error) => {
      alert(error);
      return false;
    });
};

export default register;
