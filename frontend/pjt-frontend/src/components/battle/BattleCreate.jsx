import "../../index.css";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BattleCreate() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <div className="create-container">
          <h1>Create Room [ Battle Mode ]</h1>
          <div className="pink-line"></div>
          <div className="create-box">
            <span>방 제목 : </span>
            <input className="create-title" type="text" placeholder="Enter Room Title" maxLength={30} />
          </div>
          <div className="create-button-container">
            <button className="create-button">Create</button>
            <button className="create-button" onClick={() => navigate("/battle")}>Cancle</button>
          </div>
        </div>
      </div>
    </>
  );
}
