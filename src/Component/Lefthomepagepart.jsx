// This is Actually Left side of the part

import React, { useCallback, useEffect, useState } from "react";
import "../Styles/Lefthomepagepart.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Backend/firebase-init";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import Visiblepost from "./Visiblepost";

export default function Lefthomepagepart({ searchparam }) {
  const [userInterestedTag, setInterestedTag] = useState(["Following"]);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
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

  const fetchInitialBlog = useCallback(async () => {
    const BlogCollectionRef = collection(db, "Blog");
    const queryIntent = query(
      BlogCollectionRef,
      where("blog_related_tag", "==", searchparam),
      where("user_id", "!=", auth.currentUser?.uid),
      limit(5)
    );
    const documentSnapShots = await getDocs(queryIntent);
    const blogData = documentSnapShots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBlogs(blogData);
  }, [searchparam]);

  useEffect(() => {
    console.log(searchparam);
    try {
      if (searchparam && auth.currentUser?.uid) {
        fetchInitialBlog();
      } else {
        console.log(searchparam);
      }
    } catch (error) {
      console.log("BLOG-FETCHING-ERROR-LEFT-HOMEPAGE-PART", error.message);
    }
  }, [searchparam, fetchInitialBlog]);

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
        {blogs[0]?.blog_related_tag === searchparam ? (
          <>
            {blogs
              .slice()
              .reverse()
              .map((blog) => (
                <div key={blog.id} className="blog-item">
                  <Visiblepost blogData={blog} />
                </div>
              ))}
          </>
        ) : (
          <h3>Our services are temporarily unavailable.</h3>
        )}
      </div>
    </div>
  );
}
