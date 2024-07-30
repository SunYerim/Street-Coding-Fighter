import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BattleCreate() {
  const navigate = useNavigate();

  // 방만들기 함수 만들어야됨. (소켓? http?)
  const createBattleRoom = (data) => {
  
  }

  return (
    <>
      <div className="container">
        <div className="create-container">
          <h1>Create Room [ Battle Mode ]</h1>
          <div className="pink-line"></div>
          <form className="battle-create-input">
            <div className="create-box">
              <span>방 제목 : </span>
                <input className="create-title" type="text" placeholder="Enter Room Title" maxLength={30} />
            </div>
            <div className="create-box">
              <span>비밀번호 : </span>
              <input className="create-password" type="password" />
            </div>  
            <div className="create-box">
              <span>라운드 : </span>
              <input className="create-problems" type="number" min="5" max="20" placeholder="5" />
            </div>
            <div className="create-button-container">
              <button className="create-button" onSubmit={createBattleRoom}>Create</button>
              <button className="create-button" onClick={() => navigate("/multi")}>Cancle</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
