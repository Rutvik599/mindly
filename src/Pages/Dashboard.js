import React, { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Backend/firebase-init";
import "../Styles/Dashboard.css";
export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/homepage");
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      <div className="line"></div>
      <div className="secondline"></div>
      <div className="welcometext">
        <h1 className="mindly">
          Welcome To <span className="sitename" style={{margin:"0px"}}>Mindly</span>
        </h1>
        <h4>This Page is Under Development</h4>
      </div>
    </>
  );
}
