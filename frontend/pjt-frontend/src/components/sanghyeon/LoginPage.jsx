import AccountInputBox from "./AccountInputBox.jsx";
import AccountButton from "./AccountButton.jsx";

export default function LoginPage() {
  return (
    <>
      <div>
        <AccountInputBox />
        <AccountInputBox />
        <AccountButton />
        <AccountButton />
      </div>
      <div>
        <p>Forgot username?</p>
        <p>Forgot password?</p>
      </div>
    </>
  );
}
