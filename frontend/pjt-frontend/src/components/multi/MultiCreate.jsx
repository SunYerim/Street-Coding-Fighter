import "../../index.css";
import "../../css/GameMain.css";
import "../../css/GameCreate.css";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiCreate() {
  const navigate = useNavigate();

  // const baseUrl = 'http://ssafy11s.com/api';

  // const createMultiRoom = async (data) => {
  //   const title = data.target.title.value;
  //   const userMax = data.target.userMax.value;
  //   const password = data.target.password.value;
  //   const round = data.target.round.value;
  //   axios.post(baseUrl + '/multi/room', { title, userMax, password, round })
  // }

  return (
    <>
      <div className="container">
        <div className="create-container">
          <h1>Create Room [ Multi Mode ]</h1>
          <div className="pink-line"></div>
          <form className="multi-create-input">
            <div className="create-box">
              <span>방 제목 : </span>
              <input
                className="create-title"
                type="text"
                placeholder="Enter Room Title"
                maxLength={30}
              />
            </div>
            <div className="create-box">
              <span>최대인원 : </span>
              <input
                className="create-max-number"
                type="number"
                min="1"
                max="30"
              />
            </div>
            <div className="create-box">
              <span>비밀번호 : </span>
              <input name="password" className="create-password" type="password" />
            </div>
            <div className="create-box">
              <span>라운드 : </span>
              <input name="round" className="create-problems" type="number" min="5" max="20" placeholder="5" />
            </div>
            <div className="create-button-container">
              <button className="create-button" onSubmit={createMultiRoom}>
                Create
              </button>
              <button
                className="create-button"
                onClick={() => navigate("/multi")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
