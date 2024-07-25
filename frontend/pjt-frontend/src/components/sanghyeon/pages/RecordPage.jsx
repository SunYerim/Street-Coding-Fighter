import axios from "axios";
import { useEffect } from "react";
import Header from "../components/Header";
import "../../../css/RecordPage.css";
import store from "../../../store/store.js";

function RecordPage() {
  const { userId, accessToken } = store();

  const getRecord = async function () {
    try {
      const recordRes = await axios({
        method: "GET",
        url: `http://localhost:8080/profile/record/${userId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(recordRes);
    } catch (error) {
      alert("Failed to fetch record", error);
    }
  };

  useEffect(() => {
    const fetchRecord = async function () {
      try {
        getRecord();
      } catch (error) {
        console.error("Failed to fetch record", error);
      }
    };

    fetchRecord();
  }, []);

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="record-outer-container">
          <div className="record-container">
            <h2 className="record-title">Player Name : dltkdgus482</h2>
            <hr />
            <div className="record-inner-container">
              <div className="record-inner-title">
                <p>GameType</p>
                <p>Time</p>
                <p>Rank</p>
                <p>Score</p>
              </div>
              <div className="record-inner">
                <div className="record">
                  <p>1 vs 1</p>
                  <p>2024-07-15</p>
                  <p>3rd</p>
                  <p>1557p</p>
                </div>
                <div className="record">
                  <p>1 vs 1</p>
                  <p>2024-07-15</p>
                  <p>3rd</p>
                  <p>1557p</p>
                </div>
                <div className="record">
                  <p>1 vs 1</p>
                  <p>2024-07-15</p>
                  <p>3rd</p>
                  <p>1557p</p>
                </div>
                <div className="record">
                  <p>1 vs 1</p>
                  <p>2024-07-15</p>
                  <p>3rd</p>
                  <p>1557p</p>
                </div>
                <div className="record">
                  <p>1 vs 1</p>
                  <p>2024-07-15</p>
                  <p>3rd</p>
                  <p>1557p</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordPage;
