import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { db } from "../Backend/firebase-init";
import "../Styles/Visiblepost.css";
import { Bookmark, EllipsisVertical, Share2, Smile } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";
import { useNavigate } from "react-router-dom";

export default function Visiblepost(props) {
  const [userData, setuserData] = useState(null);
  const [blogthumb_nail, setThumbnail] = useState(null);
  const { setCurrentBlogData } = useContext(blogCurrentData);
  const { setCurrentBlogUserData } = useContext(blogCurrentUserData);
  const navigate = useNavigate();

  const fetchuserData = useCallback(async () => {
    try {
      const UserProfileRef = collection(db, "users");
      const queryIntent = query(
        UserProfileRef,
        where("user_id", "==", props.blogData?.user_id)
      );
      const documentSnapShots = await getDocs(queryIntent);
      const user_data_firebase = documentSnapShots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setuserData(user_data_firebase[0]);
    } catch (error) {
      console.log("VISIBLE-POST-ERROR-USER-PROFILE-FETCHING", error.message);
    }
  }, [props.blogData?.user_id]);

  const getFirstImageSrc = (htmlContent) => {
    const tempDiv = document.createElement("div"); // Create a temporary div
    tempDiv.innerHTML = htmlContent; // Set the innerHTML to the HTML content
    const img = tempDiv.querySelector("img"); // Find the first <img> tag
    return img ? img.src : ""; // Return the src or an empty string if no img found
  };

  useEffect(() => {
    const data_image = getFirstImageSrc(props.blogData.blog_content);
    setThumbnail(data_image);

    if (props.blogData.user_id) {
      fetchuserData();
    } else {
      console.log("USER_ID IS STILL NOT AVAILABLE");
    }
  }, [props.blogData.user_id, props.blogData.blog_content, fetchuserData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit" }; // Define options for formatting
    const formattedDate = date.toLocaleDateString("en-US", options); // Format the date

    return formattedDate; // Returns "Oct 10"
  };

  const generateLink = () => {
    const { poster_title, blog_id } = props.blogData;
    const { user_name } = userData;

    // Clean the blog title
    const cleanTitle = poster_title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    // Clean the user name
    const cleanUserName = user_name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    // Construct the full URL
    const url = `/r/${cleanUserName}/${cleanTitle}-${blog_id}`;

    return url;
  };

  const shareButtonClicked = () => {
    const linkToCopy = "https://localhost:3000" + generateLink();
    console.log(linkToCopy);
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast.success("Link Has Been Copied", {
          style: { fontSize: "14px", fontFamily: "Roboto" },
        });
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
        toast.error("Failed to copy the link.");
      });
  };

  const gotoCurrentBlog = () => {
    const linkToCopy = generateLink();
    setCurrentBlogData(props.blogData);
    setCurrentBlogUserData(userData);
    console.log(linkToCopy);

    navigate(linkToCopy);
  };
  return (
    <>
      <ToastContainer
        style={{
          fontFamily: "Roboto",
          fontSize: "14px",
        }}
        autoClose={2000}
      />
      <div className="visible-post-main-div" onClick={gotoCurrentBlog}>
        <div className="top-side-visible-post">
          <img src={userData?.profile_pic_url} alt="" />
          <h3 className="user-name-visible-post">{userData?.user_name}</h3>
        </div>

        <div className="bottom-content-visible-post">
          <div className="left-side-visible-post">
            <h1 className="visible-blog-title">
              {props.blogData.poster_title}
            </h1>
            <h2 className="visible-blog-desc">
              {props.blogData.poster_description}
            </h2>
            <div className="left-side-visible-bottom">
              <div className="interaction-left-side">
                <span style={{ color: "#676767" }}>
                  {formatDate(props.blogData.uploded_at)}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "5px",
                    color: "#676767",
                  }}
                >
                  <Smile size={20} strokeWidth={1.25} color="#676767" />{" "}
                  {props.blogData.user_interaction
                    ? props.blogData.user_interaction
                    : "0"}
                </span>
              </div>
              <div className="interation-right">
                <Bookmark
                  color="#676767"
                  size={20}
                  strokeWidth={1.25}
                  style={{ cursor: "pointer" }}
                />
                <Share2
                  color="#676767"
                  size={20}
                  strokeWidth={1.25}
                  style={{ cursor: "pointer" }}
                  onClick={shareButtonClicked}
                />
                <EllipsisVertical
                  size={20}
                  strokeWidth={1.25}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          <div className="right-side-visible-post">
            <img src={blogthumb_nail} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
