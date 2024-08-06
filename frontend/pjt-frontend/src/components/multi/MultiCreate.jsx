import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import { useNavigate } from "react-router-dom";
import multiStore from '../../stores/multiStore.jsx';
import store from '../../store/store.js';
import createAuthClient from "../sanghyeon/apis/createAuthClient.js";

export default function MultiCreate() {
  const navigate = useNavigate();

  const {
    accessToken,
    setAccessToken,
    memberId,
    userId,
    name,
    baseURL,
  } = store((state) => ({
    memberId: state.memberId,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    userId: state.userId,
    name: state.name,
    baseURL: state.baseURL,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );
  
  const setRoomId = multiStore((state) => state.setRoomId);

  const createMultiRoom = async (data) => {
    data.preventDefault();
    
    try {
      // const headers = {
      //   'memberId': userId,
      //   'username': name
      // };
  
      const title = data.target.title.value;
      const maxPlayer = data.target.maxPlayer.value;
      const password = data.target.password.value;
      const gameRound = data.target.gameRound.value;

      // const response = await axios.post(
      //   `${baseURL}/multi/room`, { title, maxPlayer, password, gameRound }, { Authorization: `Bearer ${accessToken}` });
      
        const response = await authClient({
          method: "POST",
          url: `${baseURL}/multi/room`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { title, maxPlayer, password, gameRound },
        });

      const roomId = response.data;
      setRoomId(roomId);
      navigate(`/multi-game/${roomId}`, { state: { hostId: memberId } } );


    } catch (error) { 
      console.error("Error creating room:", error);
    }
  }

  return (
    <>
      <div className="container">
        <div className="create-container">
          <h1>Create Room [ Multi Mode ]</h1>
          <div className="pink-line"></div>
          <form className="multi-create-input" onSubmit={createMultiRoom}>
            <div className="create-box">
              <span>방 제목 : </span>
                <input name="title" className="create-title" type="text" placeholder="Enter Room Title" maxLength={20} />
            </div>
            <div className="create-box">
              <span>최대인원 : </span>
              <input name="maxPlayer" className="create-max-number" type="number" min="2" max="100" placeholder="10" />
            </div>
            <div className="create-box">
              <span>비밀번호 : </span>
              <input name="password" className="create-password" type="password" maxLength={20} />
            </div>
            <div className="create-box">
              <span>라운드 : </span>
              <input name="gameRound" className="create-problems" type="number" min="2" max="10" placeholder="5" />
            </div>
            <div className="create-button-container">
              <button className="create-button" type="submit">Create</button>
              <button className="create-button" onClick={() => navigate("/multi")}>Cancle</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
