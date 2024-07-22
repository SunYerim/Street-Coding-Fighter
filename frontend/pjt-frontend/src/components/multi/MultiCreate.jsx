import "../../index.css";
import "../../css/GameMain.css";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiCreate() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="create-container">
          <h1>Create Room [ Multi Mode ]</h1>
          <div className="pink-line"></div>
          <div className="create-box">
            <span>방 제목 : </span>
            <input className="create-title" type="text" placeholder="Enter Room Title" maxLength={30} />
          </div>
          <div className="create-box">
            <span>최대인원 : </span>
            <input className="create-max-number" type="number" min="1" max="30" />
          </div>
          <div className="create-button-container">
            <button className="create-button">Create</button>
            <button className="create-button" onClick={() => navigate("/multi")}>Cancle</button>
          </div>
        </div>
      </div>
    </>
  );
}
