import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import multiStore from '../../stores/multiStore.jsx';

export default function MultiCreate() {
  const navigate = useNavigate();

  const setRoomId = multiStore((state) => state.setRoomId);
  const setUserId = multiStore((state) => state.setUserId);
  const setUsername = multiStore((state) => state.setUsername);

  //*** ssafy11s.com으로 수정하기
  const baseUrl = "https://www.ssafy11s.com";

  const [userId, setLocalUserId] = useState(null);
  const [username, setLocalUsername] = useState(null);

  useEffect(() => {
    const userIdFromStore = multiStore.getState().userId;
    const usernameFromStore = multiStore.getState().username;

    setLocalUserId(userIdFromStore);
    setLocalUsername(usernameFromStore);

    setUserId(userIdFromStore);
    setUsername(usernameFromStore);
  }, [setUserId, setUsername]);

  const createMultiRoom = async (data) => {
    data.preventDefault();
    
    try {
      const headers = {
        'memberId': userId,
        'username': username
      };
  
      const title = data.target.title.value;
      const maxPlayer = data.target.maxPlayer.value;
      const password = data.target.password.value;
      const gameRound = data.target.gameRound.value;


      const response = await axios.post(`${baseUrl}/multi/room`, { title, maxPlayer, password, gameRound }, { headers });
      const roomId = response.data;
      setRoomId(roomId);
      navigate(`/multi/room/${roomId}`, { state: { hostId: userId } } );  


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
