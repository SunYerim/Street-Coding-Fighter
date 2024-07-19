import axios from "axios";

function noAuthLogin(username, password) {
  console.log(username, password);

  // axios({
  //   method: "POST",
  //   url: "/user/login",
  //   data: {
  //     username,
  //     password,
  //   },
  // }).then((response) => {
  //   console.log(response);
  // });
  // return;
}

export default noAuthLogin;
