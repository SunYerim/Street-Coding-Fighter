import { useEffect } from "react";
import Header from "../components/Header";
import "../../../css/SolvedPage.css";
import getSolved from "../apis/getSolved";

function SolvedPage() {
  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const solved = await getSolved();
        console.log(solved);
      } catch (error) {
        console.error("Failed to fetch solved", error);
      }
    };

    fetchSolved();
  }, []);

  return (
    <>
      <Header />
      <div id="solved-outer-container">
        <div id="solved-container">
          <div id="solved-title-container">
            <h2>문제 모아보기</h2>
            <select name="" id="">
              <option value="">제목순 정렬</option>
            </select>
          </div>
          <div id="sovled-problem-container">
            <div id="solved-problem-title">
              <h4>제목</h4>
              <h4>정답 유무</h4>
              <h4>난이도</h4>
            </div>
            <div id="solved-problem">
              <p>최대값 구하기</p>
              <p>o</p>
              <p>브론즈 3</p>
            </div>
            <div id="solved-problem">
              <p>최대값 구하기</p>
              <p>o</p>
              <p>브론즈 3</p>
            </div>
            <div id="solved-problem">
              <p>최대값 구하기</p>
              <p>o</p>
              <p>브론즈 3</p>
            </div>
            <div id="solved-problem">
              <p>최대값 구하기</p>
              <p>o</p>
              <p>브론즈 3</p>
            </div>
            <div id="solved-problem">
              <p>최대값 구하기</p>
              <p>o</p>
              <p>브론즈 3</p>
            </div>
          </div>
          <div id="solved-button-container">
            <button>틀린 문제만 보기</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SolvedPage;
