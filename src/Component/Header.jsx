import React, { useEffect, useMemo, useState } from "react";
import "../Styles/Header.css";
import {
  Bell,
  ChartNoAxesColumn,
  LogOut,
  Pen,
  Search,
  Settings,
  Type,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Backend/firebase-init";
import { getDoc, doc } from "firebase/firestore";
import { generateRandomId } from "../Utils/generateId";

export default function Header() {
  const [userProfilePicUrl, setUserProfileImage] = useState(null);
  const [placeholderText, setPlaceholderText] = useState("Search...");
  const [searchParams, setSearchParams] = useState("");
  const navigate = useNavigate();
  const [sidebar, setSideBarStatus] = useState(false);
  const searchSuggestions = useMemo(
    () => [
      '"Artificial Intelligence"',
      '"Blockchain"',
      '"Travel"',
      '"Cooking"',
      '"Mental Health"',
    ],
    []
  );

  useEffect(() => {
    document.title = "Welcome to Mindly";

    // Fetch profile picture and interested tags from localStorage or Firestore
    const userProfilePicUrl = localStorage.getItem("profile_pic_url");
    const userInterestedTags = localStorage.getItem("user_interested_tags");

    if (userProfilePicUrl) {
      setUserProfileImage(userProfilePicUrl);
    }

    if (!userProfilePicUrl || !userInterestedTags) {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profile_pic_url) {
              setUserProfileImage(userData.profile_pic_url);
              localStorage.setItem("profile_pic_url", userData.profile_pic_url);
            }
            if (userData.user_interested_tags) {
              const tags = userData.user_interested_tags.join(","); // Convert array to comma-separated string
              localStorage.setItem("user_interested_tags", tags);
            }
            localStorage.setItem("user_name", userData.user_name);
          }
        }
      };

      fetchUserData();
    }

    // Rotating placeholder text logic
    let index = 0;
    const interval = setInterval(() => {
      setPlaceholderText(`Search ${searchSuggestions[index]}`);
      index = (index + 1) % searchSuggestions.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [searchSuggestions]);

  const gotoSearch = () => {
    navigate(`/${searchParams}`);
  };

  const gotowrite = () => {
    navigate(`/p/${generateRandomId()}/edit`);
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
    return `${maskedLocalPart}@${domain}`;
  };
  return (
    <div className="top-class-header">
      <div className="left-header-part">
        <h1
          className="sitename"
          style={{ fontSize: "35px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Mindly
        </h1>
        <div className="search-input-div">
          <Search
            size={20}
            style={{ color: "#676767", cursor: "pointer" }}
            onClick={gotoSearch}
          />
          <input
            type="text"
            className="search-content-bar"
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder={placeholderText}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                gotoSearch();
              }
            }}
          />
        </div>
      </div>
      <div className="right-header-part">
        <div className="write-button-div" onClick={gotowrite}>
          <Pen size={18} style={{ color: "#676767" }} />
          <h3 className="write-button-h3-tag">Write</h3>
        </div>
        <Bell size={21} style={{ color: "#676767", cursor: "pointer" }} />
        <img
          src={userProfilePicUrl}
          alt=""
          className="user-profile-pic-url"
          onClick={() => setSideBarStatus(!sidebar)}
        />
      </div>

      <div
        className={`floating-window-sidebar ${sidebar ? "active" : ""}`}
        style={{ border: "1px solid #D8D8D8" }}
      >
        <div className="content">
          <UserRound size={20} strokeWidth={1.25} className="icon" />
          <h4 className="floating-window-text">Profile</h4>
        </div>
        <div className="content" onClick={() => navigate("/post/draft")}>
          <Type size={20} strokeWidth={1.25} className="icon" />
          <h4 className="floating-window-text">Your Post</h4>
        </div>
        <div className="content">
          <ChartNoAxesColumn size={20} strokeWidth={1.25} className="icon" />
          <h4 className="floating-window-text">Stats</h4>
        </div>
        <div className="content">
          <Settings size={20} strokeWidth={1.25} className="icon" />
          <h4 className="floating-window-text">Setting</h4>
        </div>
        <div className="divider"></div>
        <div className="signout">
          <div className="content">
            <LogOut size={20} color="#975757" strokeWidth={1.25} />
            <h4 className="floating-window-text" style={{ color: "#975757" }}>
              Sign Out
            </h4>
          </div>
          <h4 className="floating-window-text" style={{ color: "#975757" }}>
            {auth.currentUser ? maskEmail(auth.currentUser.email) : "No Email"}
          </h4>
        </div>
      </div>
    </div>
  );
}
