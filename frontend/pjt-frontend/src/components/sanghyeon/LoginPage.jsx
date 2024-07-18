import AccountInputBox from "./AccountInputBox.jsx";
import AccountButton from "./AccountButton.jsx";

export default function LoginPage() {
  return (
    <>
      <div>
        <AccountInputBox />
        <AccountInputBox />
        <AccountButton buttonType="Login" />
        <AccountButton buttonType="Sign Up" />
      </div>
      <div>
        <button>Forgot username?</button>
        <button>Forgot password?</button>
      </div>
    </>
  );
}
