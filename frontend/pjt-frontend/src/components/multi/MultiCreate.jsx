import "../../index.css";
import Button from "./Button.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MultiCreate() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        Multi createRoom
      </div>
    </>
  );
}
