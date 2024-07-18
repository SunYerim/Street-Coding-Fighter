import AccountInputBox from "./AccountInputBox";
import AccountButton from "./AccountButton";

export default function SignUpPage() {
  return (
    <>
      <AccountInputBox />
      <AccountInputBox />
      <AccountInputBox />
      <AccountInputBox />
      <AccountButton buttonType="Create" />
    </>
  );
}
