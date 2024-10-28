import React from "react";
import "../Styles/Teammindly.css";
import mainImage from "../Utils/femaleavatar.svg";
import virpal from "../Utils/maleavatar1.svg";
import rutvik from "../Utils/maleavatar2.svg";
import { useNavigate } from "react-router-dom";
export default function Teammindly() {
  const navigate = useNavigate();
  const gotohome = () => {
    navigate("/");
  };
  return (
    <div className="main-team-part">
      <h1 className="sitename">Mindly</h1>
      <div className="card">
        <div className="actual-card">
          <img src={mainImage} alt="female-avatar.img" className="avatar" />
          <h1 className="team-member-name">Prachi Patel</h1>
          <p className="team-member-skills">UI/UX Designer</p>
        </div>
        <div className="actual-card">
          <img src={virpal} alt="female-avatar.img" className="avatar" />
          <h1 className="team-member-name">Virpalsinh Chavda</h1>
          <p className="team-member-skills">Backend Developer</p>
        </div>
        <div className="actual-card">
          <img src={rutvik} alt="female-avatar.img" className="avatar" />
          <h1 className="team-member-name">Rutvik Patel</h1>
          <p className="team-member-skills">Fullstack Developer</p>
        </div>
      </div>
      <button className="gotohomepage" onClick={gotohome}>
        Homepage
      </button>
    </div>
  );
}
