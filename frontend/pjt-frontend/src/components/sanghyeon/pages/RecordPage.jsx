import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/RecordPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";

function RecordPage() {
  const { accessToken, setAccessToken, baseURL, memberId } = store((state) => ({
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    baseURL: state.baseURL,
    memberId: state.memberId,
  }));
  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    const getRecord = async function () {
      try {
        const recordRes = await authClient({
          method: "GET",
          url: `${baseURL}/profile/record`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            memberId: memberId,
          },
        });

        console.log(recordRes);

        setRecordData(recordRes.data);
      } catch (error) {
        console.error("Failed to fetch record", error);
      }
    };

    getRecord();
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
                {recordData.map((data, index) => {
                  return (
                    <div className="record" key={index}>
                      <p>{data.gameType}</p>
                      <p>{data.Time}</p>
                      <p>
                        {data.rank} / {data.partCnt}
                      </p>
                      <p>{data.score}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordPage;
