import createAuthClient from "../apis/createAuthClient.js";
import store from "../../../store/store.js";
import { useNavigate } from "react-router-dom";

const SignOutButton = function () {
  const {
    userId,
    accessToken,
    setAccessToken,
    baseURL,
    memberId,
    setMemberId,
  } = store((state) => ({
    userId: state.userId,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    baseURL: state.baseURL,
    memberId: state.memberId,
    setMemberId: state.setMemberId,
  }));
  const navigate = useNavigate();
  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const signOut = async () => {
    try {
      await authClient({
        method: "DELETE",
        url: `${baseURL}/user/quit/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAccessToken(null);
      setMemberId(null);
      alert("회원탈퇴에 성공했습니다.");
      navigate("/login");
    } catch (error) {
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <>
      <button onClick={signOut}>회원탈퇴</button>
    </>
  );
};

export default SignOutButton;
