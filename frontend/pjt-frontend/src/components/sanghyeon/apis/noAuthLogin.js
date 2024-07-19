import axios from "axios";

function noAuthLogin(username, password) {
  axios({
    method: "POST",
    url: "/user/login",
    data: {
      userId: username,
      password: password,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default noAuthLogin;
