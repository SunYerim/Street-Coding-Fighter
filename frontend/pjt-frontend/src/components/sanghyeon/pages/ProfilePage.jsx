import "../../../css/ProfilePage.css";
import Header from "../components/Header";
import pinia from "../../../assets/characters/pinia.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import getProfile from "../apis/getProfile";
import logOut from "../apis/logOut";
import store from "../../../store/store.js";
import SignOutButton from "../components/SignOutButton.jsx";

function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = store();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(userId);
        console.log(profile);
      } catch (error) {
        alert("Failed to fetch profile", error);
      }
    };

    fetchProfile();
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
                  <h3>Name : Jack</h3>
                  <h3>Birth Day : 98.03.19</h3>
                  <h3>Exp: 302, 483 exp</h3>
                  <h3>Character : Pinia</h3>
                  <h3>School : SSAFY</h3>
                  <div className="profile-status-button">
                    <button onClick={logOut}>비밀번호 수정</button>
                    <SignOutButton />
                  </div>
                </div>
                <div className="profile-character-img-container">
                  <img
                    className="profile-character-img"
                    src={pinia}
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
