import axios from "axios";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import store from "../../store/store.js";

const noAuthLogin = async function (username, password) {
  const { setUserId, setName } = store();

  await axios({
    method: "POST",
    url: "/user/login",
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
