// This is Actually Left side of the part

import React, { useEffect, useState } from "react";
import "../Styles/Lefthomepagepart.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Lefthomepagepart({ searchparam }) {
  const [userInterestedTag, setInterestedTag] = useState(["Following"]);
  const navigate = useNavigate();
  useEffect(() => {
    const tags = localStorage.getItem("user_interested_tags");
    if (tags) {
      const og_tags = tags.split(",").map((tag) => tag.trim());
      console.log(og_tags);

      setInterestedTag((prevTags) => {
        const combinedTags = [...prevTags, ...og_tags];
        return Array.from(new Set(combinedTags));
      });
    }
  }, []);

  return (
    <div className="left-side-of-the-part">
      <div className="user-interested-tag">
        <Plus
          strokeWidth={1.2}
          size={20}
          style={{ cursor: "pointer", paddingBottom: "10px" }}
        />
        {userInterestedTag.map((tag, index) => (
          <h4
            key={index}
            className={`tags ${
              searchparam === tag || (index === 0 && searchparam === undefined)
                ? "active"
                : ""
            }`}
            onClick={() => {
              if (tag === "Following") {
                navigate(`/`); // Navigate to root if "Following" is clicked
              } else {
                navigate(`/${tag}`); // Navigate to the specific tag otherwise
              }
            }}
          >
            {tag}
          </h4>
        ))}
      </div>
      <div className="actucal-content-blog">
        <h3>Our services are temporarily unavailable.</h3>
      </div>
    </div>
  );
}
