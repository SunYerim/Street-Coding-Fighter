import { useNavigate } from "react-router-dom";

export default function TitlePage() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1>Street Coding</h1>
        <h1>Fighter</h1>
      </div>
      <button onClick={() => navigate("/login")}>Start!</button>
    </>
  );
}
