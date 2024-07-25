import axios from "axios";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";

const SignOutButton = function () {
  const { userId } = store();
  const navigate = useNavigate();

  const signOut = function () {
    try {
      axios({
        method: "DELETE",
        url: `/user/${userId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          alert("회원탈퇴에 성공했습니다.");
          navigate("/login");
        })
        .catch((error) => {
          alert("회원탈퇴에 실패했습니다.");
        });
    } catch (error) {
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <>
      <button onClick={() => signOut()}>회원탈퇴</button>
    </>
  );
};

export default SignOutButton;
