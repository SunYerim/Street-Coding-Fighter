import Header from "../components/Header";
import "../../../css/ReportPage.css";
import greenSlime from "../../../assets/characters/movingGreenSlime.gif";

const ReportPage = () => {
  return (
    <>
      <div className="report-entire-container">
        <Header />
        <div className="report-outer-outer-container">
          <div className="report-outer-container">
            <div className="report-upper-container">
              <div className="report-profile-container">
                <img
                  src={greenSlime}
                  alt="profile-character"
                  className="report-profile-character"
                />
                <div className="report-profile-name">Jack</div>
              </div>
              <div className="report-upper-title-container">
                <div className="report-upper-title-inner-container">
                  <div className="report-upper-sub-title">AI 스킬 평가</div>
                  <div className="report-upper-title">
                    Problem Solving 평가 리포트
                    <span className="report-beta">Beta</span>
                  </div>
                </div>
                <div className="report-upper-title-button-container">
                  <button className="report-upper-title-button">
                    맞춘 문제 수: 25 개
                  </button>
                  <button className="report-upper-title-button">
                    시도한 문제 수: 26 개
                  </button>
                  <button className="report-upper-title-button">
                    분석 리포트 PDF 다운로드
                  </button>
                </div>
              </div>
            </div>
            <div className="report-lower-container">
              <div className="report-lower-title-container">
                <div className="report-lower-title">AI 종합 분석</div>
                <div className="report-lower-sub-title">
                  SCF AI가 예측한 문제 해결 확률과 점수를 토대로 앞으로의 학습
                  방향을 제안해드립니다.
                </div>
              </div>
              <div className="report-inner-container">
                <div className="report">
                  <span style={{ color: "blue" }}>
                    자료구조, 탐색, 구현, 수학
                  </span>{" "}
                  영역에서 높은 문제 해결력을 갖추고 있습니다. 문제 해결력을 더
                  높이고 싶다면{" "}
                  <span style={{ color: "red" }}>수학, 문자열, 구현</span>{" "}
                  카테고리를 학습해보는 것을 권장합니다. 자료구조, 탐색, 구현,
                  수학 영역에서 높은 문제 해결력을 갖추고 있습니다.{" "}
                  <span style={{ color: "blue" }}>
                    자료구조, 탐색, 구현, 수학
                  </span>{" "}
                  영역에서 높은 문제 해결력을 갖추고 있습니다. 문제 해결력을 더
                  높이고 싶다면{" "}
                  <span style={{ color: "red" }}>수학, 문자열, 구현</span>{" "}
                  카테고리를 학습해보는 것을 권장합니다. 자료구조, 탐색, 구현,
                  수학 영역에서 높은 문제 해결력을 갖추고 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportPage;
