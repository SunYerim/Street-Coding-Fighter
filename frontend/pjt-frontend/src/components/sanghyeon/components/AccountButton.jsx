import { useNavigate } from "react-router-dom";

export default function AccountButton(props) {
  const { buttonType } = props;
  const navigate = useNavigate();

  const handleClick = function () {
    if (buttonType === "Login") {
      console.log(props);
    } else if (buttonType === "Sign Up") {
      navigate("/signup");
    } else if (buttonType === "Create") {
      console.log("Create");
    } else {
      console.log("Error");
    }
  };

  return (
    <>
      <button onClick={handleClick}>{buttonType}</button>
    </>
  );
}
