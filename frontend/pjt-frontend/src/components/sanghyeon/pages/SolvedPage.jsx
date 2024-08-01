import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/SolvedPage.css";
import createAuthClient from "../apis/createAuthClient";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";

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
        // const solvedRes = await authClient({
        //   method: "GET",
        //   url: `${baseURL}/profile/solved`,
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        // setSolvedData(solvedRes.data);

        const solved = [
          {
            solvedId: 1,
            isCorrect: false,
            choice: "A",
            title: "문제1",
            difficulty: 4,
            category: "category1",
            type: "type1",
          },
          {
            solvedId: 2,
            isCorrect: true,
            choice: "B",
            title: "문제2",
            difficulty: 2,
            category: "category2",
            type: "type2",
          },
          {
            solvedId: 3,
            isCorrect: false,
            choice: "C",
            title: "문제3",
            difficulty: 1,
            category: "category3",
            type: "type3",
          },
          {
            solvedId: 4,
            isCorrect: true,
            choice: "D",
            title: "문제4",
            difficulty: 4,
            category: "category4",
            type: "type4",
          },
          {
            solvedId: 5,
            isCorrect: true,
            choice: "A",
            title: "문제5",
            difficulty: 3,
            category: "category5",
            type: "type5",
          },
          {
            solvedId: 6,
            isCorrect: false,
            choice: "B",
            title: "문제6",
            difficulty: 2,
            category: "category6",
            type: "type6",
          },
          {
            solvedId: 7,
            isCorrect: true,
            choice: "C",
            title: "문제7",
            difficulty: 1,
            category: "category7",
            type: "type7",
          },
          {
            solvedId: 8,
            isCorrect: false,
            choice: "D",
            title: "문제8",
            difficulty: 4,
            category: "category8",
            type: "type8",
          },
          {
            solvedId: 9,
            isCorrect: true,
            choice: "E",
            title: "문제9",
            difficulty: 3,
            category: "category9",
            type: "type9",
          },
          {
            solvedId: 10,
            isCorrect: false,
            choice: "F",
            title: "문제10",
            difficulty: 2,
            category: "category10",
            type: "type10",
          },
        ];
        setSolvedData(solved);
      } catch (error) {
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
      } else if (sortOption === "correctness") {
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
                    onClick={() => navigate("/solved/" + data.solvedId)}
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
