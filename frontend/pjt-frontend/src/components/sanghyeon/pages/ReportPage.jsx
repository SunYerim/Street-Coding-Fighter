import Header from "../components/Header";
import "../../../css/ReportPage.css";
import { useEffect } from "react";
import getReport from "../apis/getReport";

function ReportPage() {
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const report = await getReport();
        console.log(report);
      } catch (error) {
        console.error("Failed to fetch report", error);
      }
    };

    fetchReport();
  }, []);

  return (
    <>
      <div className="outer-container">
        <Header />
        <div className="report-outer-container">
          <div className="report-container">
            <h2 className="report-title">Report</h2>
            <hr />
            <div className="report">보고서</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportPage;
