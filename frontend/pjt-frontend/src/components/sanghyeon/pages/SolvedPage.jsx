import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../../../css/SolvedPage.css";
import getSolved from "../apis/getSolved";

function SolvedPage() {
  const [solvedData, setSolvedData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        // const solved = await getSolved();
        const solved = [
          { title: "최대값 구하기", isSolved: false, difficulty: "3" },
          { title: "A + B 구하기", isSolved: true, difficulty: "4" },
          { title: "합 구하기", isSolved: false, difficulty: "5" },
          { title: "문자 출력하기", isSolved: true, difficulty: "2" },
          { title: "곱셈 구하기", isSolved: true, difficulty: "3" },
        ];
        solved.sort((a, b) => a.title.localeCompare(b.title));
        setSolvedData(solved);
        setSortedData(solved);
      } catch (error) {
        console.error("Failed to fetch solved", error);
      }
    };

    fetchSolved();
  }, []);

  useEffect(() => {
    if (sortOption) {
      const sorted = [...solvedData];
      if (sortOption === "title") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === "difficulty") {
        sorted.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
      } else if (sortOption === "correctness") {
        sorted.sort((a, b) =>
          a.correct === b.correct ? 0 : a.correct ? -1 : 1
        );
      }
      setSortedData(sorted);
    }
  }, [sortOption, solvedData]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="solved-outer-container">
          <div className="solved-container">
            <div className="solved-title-container">
              <h2 className="solved-title">Player Name : dltkdgus482</h2>
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
                {sortedData.map((data, index) => {
                  return (
                    <div className="solved" key={index}>
                      <p>{data.title}</p>
                      <p>{data.isSolved ? "O" : "X"}</p>
                      <p>{data.difficulty}</p>
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

export default SolvedPage;
