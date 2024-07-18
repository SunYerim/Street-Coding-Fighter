import { useNavigate } from "react-router-dom";

export default function TitlePage() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1>
          Street Coding
          <br />
          Figther
        </h1>
      </div>
      <button onClick={() => navigate("/login")}>Start!</button>
    </>
  );
}
