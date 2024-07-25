import axios from "axios";
import { Cookies } from "react-cookie";
import * as jwt_decode from "jwt-decode";

const noAuthLogin = function (username, password, setUserId, setName) {
  axios({
    method: "POST",
    url: "/user/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      userId: username,
      password: password,
    },
  })
    .then((response) => {
      const cookie = new Cookies();

      cookie.set("accessToken", response.data.accessToken);
      cookie.set("refreshToken", response.data.refreshToken);

      const decode = jwt_decode(response.data.accessToken);
      setUserId(decode.memberId);
      setName(decode.name);
    })
    .catch((error) => {
      alert(error);
    });
};

export default noAuthLogin;
