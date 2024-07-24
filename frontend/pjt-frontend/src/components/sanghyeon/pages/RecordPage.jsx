import { useEffect } from "react";
import Header from "../components/Header";
import "../../../css/RecordPage.css";
import getRecord from "../apis/getRecord";

function RecordPage() {
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const record = await getRecord();
        console.log(record);
      } catch (error) {
        console.error("Failed to fetch record", error);
      }
    };

    fetchRecord();
  }, []);

  return (
    <>
      <Header />
      <div id="outer-container">
        <div id="record-container">
          <div id="name-container">
            <h2>Player Name: dltkdgus482</h2>
            <hr />
          </div>
          <div id="records">
            <h4>GameType Time Rank Score</h4>
            <hr />
            <div id="record">1 : 1 2024-07-15 15:50 3/20 88848p</div>
            <div id="record">1 : 1 2024-07-15 15:50 3/20 88848p</div>
            <div id="record">1 : 1 2024-07-15 15:50 3/20 88848p</div>
            <div id="record">1 : 1 2024-07-15 15:50 3/20 88848p</div>
            <div id="record">1 : 1 2024-07-15 15:50 3/20 88848p</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordPage;
