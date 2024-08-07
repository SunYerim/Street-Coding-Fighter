import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/RecordPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";

function RecordPage() {
  const { accessToken, setAccessToken, baseURL, memberId, name } = store(
    (state) => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      baseURL: state.baseURL,
      memberId: state.memberId,
      name: state.name,
    })
  );

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const [recordData, setRecordData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getRecord = async function () {
      try {
        const recordRes = await authClient({
          method: "GET",
          url: `${baseURL}/profile/record`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setRecordData(
          recordRes.data.historyLists ? recordRes.data.historyLists : []
        );
      } catch (error) {
        console.error("Failed to fetch record", error);
      }
    };

    getRecord();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recordData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(recordData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="record-outer-container">
          <div className="record-container">
            <h2 className="record-title">Player Name : {name}</h2>
            <hr />
            <div className="record-inner-container">
              <div className="record-inner-title">
                <p>GameType</p>
                <p>Time</p>
                <p>Rank</p>
                <p>Score</p>
              </div>
              <div className="record-inner">
                {currentItems.map((data, index) => (
                  <div className="record" key={index}>
                    <p>{data.gametype}</p>
                    <p>{data.time}</p>
                    <p>{data.rank}</p>
                    <p>{data.score}</p>
                  </div>
                ))}
              </div>
              <div className="record-pagination">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={number === currentPage ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordPage;
