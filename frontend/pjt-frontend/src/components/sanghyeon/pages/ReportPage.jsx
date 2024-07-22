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
      <Header />
      <div className="report-container">
        <div className="report-title">
          <h2>Report</h2>
        </div>
        <hr />
        <div className="report">보고서</div>
      </div>
    </>
  );
}

export default ReportPage;
