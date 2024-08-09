import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/SolvedPage.css";
import createAuthClient from "../apis/createAuthClient";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SolvedPage() {
  const navigate = useNavigate();

  const [solvedData, setSolvedData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOption, setSortOption] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    const getSolved = async () => {
      try {
        const solvedRes = await authClient({
          method: "GET",
          url: `${baseURL}/profile/solved`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setSolvedData(
          solvedRes.data.solvedList ? solvedRes.data.solvedList : []
        );
      } catch (error) {
        Swal.fire({
          text: "문제를 불러오는데 실패했습니다.",
          icon: "error",
        });
        console.error("Failed to fetch record", error);
      }
    };

    getSolved();
  }, []);

  useEffect(() => {
    if (sortOption && solvedData.length > 0) {
      const sorted = [...solvedData];
      if (sortOption === "title") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === "difficulty") {
        sorted.sort((a, b) => a.difficulty - b.difficulty);
      } else if (sortOption === "isCorrect") {
        sorted.sort((a, b) =>
          a.isCorrect === b.isCorrect ? 0 : a.isCorrect ? -1 : 1
        );
      }
      setSortedData(sorted);
    }
  }, [sortOption, solvedData]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="solved-outer-container">
          <div className="solved-container">
            <div className="solved-title-container">
              <h2 className="solved-title">Player Name : {name}</h2>
              <select name="" id="" className="" onChange={handleSortChange}>
                <option value="title">제목순</option>
                <option value="difficulty">난이도순</option>
              </select>
            </div>
            <hr />
            <div className="solved-inner-container">
              <div className="solved-inner-title">
                <p>제목</p>
                <p>정답 유무</p>
                <p>난이도</p>
              </div>
              <div className="solved-inner">
                {currentItems.map((data, index) => (
                  <div
                    className="solved"
                    // onClick={() => navigate("/solved/" + data.solvedId)}
                    onClick={Swal.fire({
                      text: "준비 중입니다.",
                      icon: "waning",
                    })}
                    key={index}
                  >
                    <p>{data.title}</p>
                    <p>{data.isCorrect ? "O" : "X"}</p>
                    <p>{data.difficulty}</p>
                  </div>
                ))}
              </div>
              <div className="solved-pagination">
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

export default SolvedPage;
