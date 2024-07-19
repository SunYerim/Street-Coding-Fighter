import axios from "axios";

function register(userId, name, password1, schoolName, birth) {
  axios({
    method: "POST",
    url: "/user/join",
    data: {
      userId,
      name,
      password1,
      schoolName,
      birth,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default register;
