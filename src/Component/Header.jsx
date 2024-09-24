import React, { useEffect, useState } from "react";
import "../Styles/Header.css";
import { Bell, Pen, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Backend/firebase-init";
import { getDoc, doc } from "firebase/firestore"; 
import { generateRandomId } from "../Utils/generateId";

export default function Header() {
  const [userProfilePicUrl, setUserProfileImage] = useState(null);
  const [placeholderText, setPlaceholderText] = useState("Search...");
  const [searchParams, setSearchParams] = useState("");
  const navigate = useNavigate();

  const searchSuggestions = [
    '"Artificial Intelligence"',
    '"Blockchain"',
    '"Travel"',
    '"Cooking"',
    '"Mental Health"',
  ];

  useEffect(() => {
    document.title = "Welcome to Mindly";

    const userProfilePicUrl = localStorage.getItem("profile_pic_url");

    if (userProfilePicUrl) {
      setUserProfileImage(userProfilePicUrl);
    } else {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfileImage(userData.profile_pic_url);
            localStorage.setItem('profile_pic_url', userData.profile_pic_url);
          }
        }
      };

      fetchUserData();
    }

    let index = 0;
    const interval = setInterval(() => {
      setPlaceholderText(`Search ${searchSuggestions[index]}`);
      index = (index + 1) % searchSuggestions.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const gotoSearch = () => {
    navigate(`/${searchParams}`);
  }

  const gotowrite = () =>{
    navigate(`/p/${generateRandomId()}/edit`);
  }

  return (
    <div className="top-class-header">
      <div className="left-header-part">
        <h1 className="sitename" style={{ fontSize: "35px" }}>Mindly</h1>
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
        <img src={userProfilePicUrl} alt="" className="user-profile-pic-url" />
      </div>
    </div>
  );
}
