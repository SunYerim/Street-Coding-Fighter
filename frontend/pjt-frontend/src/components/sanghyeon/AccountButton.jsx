import { useNavigate } from "react-router-dom";

export default function AccountButton({ buttonType }) {
  const navigate = useNavigate();

  const handleClick = function () {
    if (buttonType === "Login") {
      console.log("Login");
    } else if (buttonType === "Sign Up") {
      navigate("/signup");
    } else if (buttonType === "Create") {
      console.log("Create");
    }
  };

  return (
    <>
      <button onClick={handleClick}>{buttonType}</button>
    </>
  );
}
