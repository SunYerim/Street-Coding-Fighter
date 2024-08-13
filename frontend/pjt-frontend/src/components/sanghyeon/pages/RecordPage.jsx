import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/RecordPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";
import Swal from "sweetalert2";

const RecordPage = () => {
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
  const itemsPerPage = 4;

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
        Swal.fire({
          text: "기록을 불러오는데 실패했습니다.",
          icon: "error",
          timer: 3000,
        });
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
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((data, index) => (
                    <div className="record" key={index}>
                      <p>{data.gametype === 0 ? "Multi" : "Battle"}</p>
                      <p>{new Date(data.time).toLocaleString()}</p>
                      <p>{data.rank}</p>
                      <p>{data.score}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <h1>최근 플레이한 게임이 없습니다.</h1>
                  </>
                )}
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
};

export default RecordPage;
