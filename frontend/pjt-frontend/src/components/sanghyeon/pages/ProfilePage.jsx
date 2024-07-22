import "../../../css/ProfilePage.css";
import Header from "../components/Header";
import pinia from "../../../assets/characters/pinia.svg";
import { useNavigate } from "react-router-dom";
import getProfile from "../apis/getProfile";
import { useEffect } from "react";

function ProfilePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        console.log(profile);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <div id="container">
        <div id="profile-container">
          <h2>My Profile</h2>
          <hr />
          <div id="character-button-container">
            <div id="character-container">
              <div>
                <div id="status-container">
                  <p>Name: Jack</p>
                  <p>BirthDay: 98.03.19</p>
                  <p>Exp: 302,483 exp</p>
                  <p>Point: 55,324 point</p>
                  <p>Pet: Pinia</p>
                  <p>School: SSAFY</p>
                </div>
                <div id="button-container2">
                  <button>Logout</button>
                  <button>Sign Out</button>
                </div>
              </div>
              <div id="character-img">
                <img src={pinia} alt="pinia-character" />
              </div>
            </div>
            <div id="button-container2">
              <button onClick={() => navigate("/record")}>RECORD</button>
              <button onClick={() => navigate("/report")}>REPORT</button>
              <button onClick={() => navigate("/solved")}>SOLVED</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
