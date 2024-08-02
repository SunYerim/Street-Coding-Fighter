import Header from "../components/Header";
import MainSelectModeBox from "../components/MainSelectModeBox";
import "../../../css/MainPage.css";
import { useEffect } from "react";
import createAuthClient from "../apis/createAuthClient";
import store from "../../../store/store.js";

function MainPage() {
  const {
    baseURL,
    accessToken,
    setAccessToken,
    setName,
    setSchoolName,
    setBirth,
    setCharacter,
    setExp,
  } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    setName: state.setName,
    setSchoolName: state.setSchoolName,
    setBirth: state.setBirth,
    setCharacter: state.setCharacter,
    setExp: state.setExp,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoRes = await authClient({
          method: "GET",
          url: `${baseURL}/user/info`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setName(userInfoRes.data.name);
        setSchoolName(userInfoRes.data.school);
        setBirth(userInfoRes.data.birth);
        setCharacter(userInfoRes.data.character);
        setExp(userInfoRes.data.exp);
      } catch (error) {
        alert("Failed to get profile", error);
      }
    };

    getUserInfo();
  }, []);

  return (
    <>
      <Header />
      <div className="mode-container">
        <MainSelectModeBox mode="싱글플레이" />
        <MainSelectModeBox mode="멀티플레이" />
        <MainSelectModeBox mode="1 vs 1" />
        <MainSelectModeBox mode="랭킹" />
      </div>
    </>
  );
}

export default MainPage;
