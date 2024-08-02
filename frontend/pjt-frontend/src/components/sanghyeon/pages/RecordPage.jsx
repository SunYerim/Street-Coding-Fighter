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
        // const recordRes = await authClient({
        //   method: "GET",
        //   url: `${baseURL}/profile/record`,
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        // setRecordData(recordRes.data);
        const dummyData = [
          { gameType: "Type1", Time: "10:00", rank: 1, partCnt: 5, score: 100 },
          { gameType: "Type2", Time: "12:00", rank: 2, partCnt: 5, score: 90 },
          { gameType: "Type3", Time: "14:00", rank: 3, partCnt: 5, score: 80 },
          { gameType: "Type4", Time: "16:00", rank: 4, partCnt: 5, score: 70 },
          { gameType: "Type5", Time: "18:00", rank: 5, partCnt: 5, score: 60 },
          { gameType: "Type6", Time: "20:00", rank: 6, partCnt: 5, score: 50 },
          { gameType: "Type7", Time: "22:00", rank: 7, partCnt: 5, score: 40 },
          { gameType: "Type8", Time: "00:00", rank: 8, partCnt: 5, score: 30 },
          { gameType: "Type9", Time: "02:00", rank: 9, partCnt: 5, score: 20 },
          {
            gameType: "Type10",
            Time: "04:00",
            rank: 10,
            partCnt: 5,
            score: 10,
          },
        ];
        setRecordData(dummyData);
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
                    <p>{data.gameType}</p>
                    <p>{data.Time}</p>
                    <p>
                      {data.rank} / {data.partCnt}
                    </p>
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
