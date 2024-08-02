// apiClient.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const createAuthClient = (baseURL, getAccessToken, setAccessToken) => {
  const authClient = axios.create({
    baseURL,
    withCredentials: true,
  });

  const getNewToken = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: `${baseURL}/user/public/reissue`,
        withCredentials: true,
      });

      const authorizationHeader = res.headers["authorization"];
      const accessToken = authorizationHeader
        ? authorizationHeader.replace(/^Bearer\s+/i, "")
        : null;

      setAccessToken(accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  authClient.interceptors.request.use(async (config) => {
    let accessToken = getAccessToken();

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (Date.now() >= exp * 1000) {
        await getNewToken();
        accessToken = getAccessToken();
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  return authClient;
};

export default createAuthClient;
