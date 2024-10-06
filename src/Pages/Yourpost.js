import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Component/Header";
import { auth, db } from "../Backend/firebase-init";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../Styles/Yourpost.css";
import Postposter from "../Component/Postposter";

export default function Yourpost() {
  const { status } = useParams();
  const [userBlogs, setUserBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const userId = auth.currentUser?.uid;

      // Create a query to get blogs where user_id is equal to userId
      const blogsRef = collection(db, "Blog");
      const q = query(blogsRef, where("user_id", "==", userId));

      try {
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the fetched blogs
        setUserBlogs(blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      }
    };

    fetchUserBlogs();
  }, []);

  return (
    <>
      <Header />
      <div className="your-story-bottom">
        <h1 className="your-post-tag">Your Post</h1>
        <div className="buttons">
          <button
            className={`draft ${status === "draft" ? "active" : ""}`}
            onClick={() => navigate("/post/draft")}
          >
            Draft
          </button>
          <button
            className={`published ${status === "publish" ? "active" : ""}`}
            onClick={() => navigate("/post/publish")}
          >
            Published
          </button>
        </div>
        {userBlogs
          .filter(
            (blog) => blog.blog_status.toLowerCase() === status?.toLowerCase()
          )
          .map((blog) => (
            <div className="storyPoster" key={blog.blog_id}>
              <Postposter blogData={blog} />
            </div>
          ))}
        {userBlogs.filter(
          (blog) => blog.blog_status.toLowerCase() === status?.toLowerCase()
        ).length === 0 && (
          <div className="no-data-message">
            Currently, there are no items available.
          </div>
        )}
      </div>
    </>
  );
}
