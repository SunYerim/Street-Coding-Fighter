import "../../../css/ProfilePage.css";
import Header from "../components/Header";
import pinia from "../../../assets/characters/pinia.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import store from "../../../store/store.js";
import SignOutButton from "../components/SignOutButton.jsx";
import createAuthClient from "../apis/createAuthClient.js";
import greenSlime from "../../../assets/characters/greenSlime.gif";

function ProfilePage() {
  const navigate = useNavigate();
  const { baseURL, accessToken, setAccessToken, memberId } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    memberId: state.memberId,
  }));

  const {
    name,
    schoolName,
    birth,
    character,
    exp,
    setName,
    setSchoolName,
    setBirth,
    setCharacter,
    setExp,
  } = store((state) => ({
    name: state.name,
    schoolName: state.schoolName,
    birth: state.birth,
    character: state.character,
    exp: state.exp,
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
    const getProfile = async () => {
      try {
        const profileRes = await authClient({
          method: "GET",
          url: `${baseURL}/profile/${memberId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(profileRes);

        setName(profileRes.data.name);
        setSchoolName(profileRes.data.school);
        setBirth(profileRes.data.birth);
        setCharacter(profileRes.data.character);
        setExp(profileRes.data.exp);
      } catch (error) {
        alert("Failed to get profile", error);
      }
    };

    getProfile();
  }, []);

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="profile-outer-container">
          <div className="profile-container">
            <h2 className="profile-title">My Profile</h2>
            <hr />
            <div className="profile-character-container">
              <div className="profile-character">
                <div className="profile-status">
                  <h3>Name : {name}</h3>
                  <h3>Birth Day : {birth}</h3>
                  <h3>Exp: {exp ? exp.toLocaleString() : 0} exp</h3>
                  <h3>Character : {character}</h3>
                  <h3>School : {schoolName}</h3>
                  <div className="profile-status-button">
                    <button onClick={() => alert("미구현")}>
                      비밀번호 수정
                    </button>
                    <SignOutButton />
                  </div>
                </div>
                <div className="profile-character-img-container">
                  <img
                    className="profile-character-img"
                    src={greenSlime}
                    alt="pinia-character"
                  />
                </div>
              </div>
              <div className="profile-button-container">
                <button onClick={() => navigate("/record")}>RECORD</button>
                <button onClick={() => navigate("/report")}>REPORT</button>
                <button onClick={() => navigate("/solved")}>SOLVED</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
