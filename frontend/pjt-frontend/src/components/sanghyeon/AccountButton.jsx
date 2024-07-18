import { useNavigate } from "react-router-dom";

export default function AccountButton({ buttonType }) {
  const navigate = useNavigate();

  const Login = function () {
    console.log("Login");
  };

  const handleClick = function () {
    if (buttonType === "Login") {
      Login();
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
