import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {Outlet, Route, Routes, useNavigate, useOutlet } from "react-router-dom";
import { auth } from "../Backend/firebase-init";
import Header from "../Component/Header";
import Lefthomepagepart from "../Component/Lefthomepagepart";
import Otherpage from "./Otherpage";
export default function Dashboard() {
  const navigate = useNavigate();
  const outlet = useOutlet();
  useEffect(() => {
    document.title = "Mindly";
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/homepage");
      }
    });
    return () => unsubscribe();
  }, []);

  return outlet ? (
    <Outlet />
  ) : (
    <>
      {/*<Header/>
      <Lefthomepagepart searchparam='Following'/>*/}
    </>
  );

}
