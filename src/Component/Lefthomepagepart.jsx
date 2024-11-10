// This is the part where the actual part is visible

import React, { useCallback, useEffect, useState } from "react";
import "../Styles/Lefthomepagepart.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Backend/firebase-init";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import Visiblepost from "./Visiblepost";
import { blogTags } from "../Utils/tags.js";
import { generateRandomId } from "../Utils/generateId";

export default function Lefthomepagepart({ searchparam }) {
  const [userInterestedTag, setInterestedTag] = useState(["Following"]);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [recommendedTags, setrecommendedTags] = useState([]);

  const getRandomTags = (tags, count = 6) => {
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    return shuffledTags.slice(0, count);
  };

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

    const randomTags = getRandomTags(blogTags);
    setrecommendedTags(randomTags);
  }, []);

  const fetchInitialBlog = useCallback(async () => {
    if (!auth.currentUser?.uid) return;
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
    console.log("This is My blog data", blogs);
  }, [searchparam]);

  const fetchFollowingblog = async () => {
    if (!auth.currentUser?.uid) return;
    setBlogs([]);
    const followingIntent = collection(db, "Follower");
    const queryIntent = query(
      followingIntent,
      where("follower_id", "==", auth.currentUser.uid)
    );
    const documentSnapShots = await getDocs(queryIntent);
    const followingData = documentSnapShots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const followeeIds = followingData.map((item) => item.followee_id);

    const BlogCollectionRef = collection(db, "Blog");

    // Assuming `user_ids` is an array of user IDs from which you want to fetch blogs
    if (!followeeIds || followeeIds.length === 0) return; // Ensure `user_ids` is not empty

    const queryIntent1 = query(
      BlogCollectionRef,
      where("user_id", "in", followeeIds),
      where("blog_status", "==", "Publish"),
      limit(5)
    );

    const documentSnapShots1 = await getDocs(queryIntent1);
    const blogData = documentSnapShots1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBlogs(blogData);
  };

  useEffect(() => {
    console.log(searchparam);
    try {
      if (searchparam) {
        console.log("calling Fetch method");
        fetchInitialBlog();
        console.log("calling after Fetch method");
      } else {
        fetchFollowingblog();
      }
    } catch (error) {
      console.log("BLOG-FETCHING-ERROR-LEFT-HOMEPAGE-PART", error.message);
    }
  }, [searchparam, fetchInitialBlog]);

  const navigatetowrite = () => {
    navigate(`/p/${generateRandomId()}/edit`);
  };

  const gotosearch = (tag) => {
    navigate(`/searchresult/${tag}`);
  };
  // here is the actual jsx is Starting
  return (
    <div className="main-tag">
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
                searchparam === tag ||
                (index === 0 && searchparam === undefined)
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
          {blogs[0]?.blog_related_tag === searchparam ||
          (searchparam === undefined && blogs) ? (
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
      <div className="right-side-of-the-part">
        <div className="recommended-title-div">
          <h1 className="recommended-title">Recomended Title</h1>
          <div className="actual-recommended-title">
            {recommendedTags.map((tag, index) => (
              <span
                key={index}
                className="tag-item-recommended"
                onClick={() => gotosearch(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="trending-topics">
          <div className="trending-topics-title">
            <h1 className="recommended-title">Trending Topics</h1>
            <p className="trending-topics-view">view</p>
          </div>
          <div className="trending-data">
            <div className="fake-skeleton">
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item short"></div>
            </div>
            <div className="fake-skeleton">
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item short"></div>
            </div>
            <div className="fake-skeleton">
              <div className="skeleton-item"></div>
              <div className="skeleton-item"></div>
              <div className="skeleton-item short"></div>
            </div>
          </div>
          <div className="right-bottom-part">
            <div className="trending-topics-title">
              <h1 className="recommended-title">Write Some Emotions</h1>
              <p className="trending-topics-view" onClick={navigatetowrite}>
                Let's Go
              </p>
            </div>
            <p className="right-bottom-thoughts">
              "Start Writing Now" with Our New Voice-to-Text Feature Make
              Writing Easier and Faster
            </p>
            <div className="footer-buttons">
              <button
                className="footer-bottom-right"
                onClick={() => navigate("/teammindly")}
              >
                Team Mindly
              </button>
              <button className="footer-bottom-right">Contact</button>
              <button className="footer-bottom-right">About</button>
              <button className="footer-bottom-right">Terms</button>
              <button className="footer-bottom-right">Help</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
