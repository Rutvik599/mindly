import React, { useContext, useEffect, useState } from "react";

import "../Styles/Visiblepost.css";
import { Bookmark, EllipsisVertical, Share2, Smile } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";
import { useNavigate } from "react-router-dom";

export default function Publicprofilepost(props) {
  const [blogthumb_nail, setThumbnail] = useState(null);
  const { setCurrentBlogData } = useContext(blogCurrentData);
  const { setCurrentBlogUserData } = useContext(blogCurrentUserData);
  const navigate = useNavigate();

  const getFirstImageSrc = (htmlContent) => {
    const tempDiv = document.createElement("div"); // Create a temporary div
    tempDiv.innerHTML = htmlContent; // Set the innerHTML to the HTML content
    const img = tempDiv.querySelector("img"); // Find the first <img> tag
    return img ? img.src : ""; // Return the src or an empty string if no img found
  };

  useEffect(() => {
    const data_image = getFirstImageSrc(props.blogData.blog_content);
    setThumbnail(data_image);
  }, [props.blogData.user_id, props.blogData.blog_content]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit" }; // Define options for formatting
    const formattedDate = date.toLocaleDateString("en-US", options); // Format the date

    return formattedDate; // Returns "Oct 10"
  };

  const generateLink = () => {
    const { poster_title, blog_id } = props.blogData;
    const { user_name } = props.userData;

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
    setCurrentBlogUserData(props.userData);
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
      <div className="visible-post-main-div">
        <div className="bottom-content-visible-post">
          <div className="left-side-visible-post">
            <h1 className="visible-blog-title" onClick={gotoCurrentBlog}>
              {props.blogData.poster_title}
            </h1>
            <h2 className="visible-blog-desc" onClick={gotoCurrentBlog}>
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
                {!props.isSaved && (
                  <Bookmark
                    color="#676767"
                    size={20}
                    strokeWidth={1.25}
                    style={{ cursor: "pointer" }}
                  />
                )}
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
            <p className="tag-bottom-which-type">
              Written on {props.blogData.blog_related_tag}
            </p>
          </div>

          <div className="right-side-visible-post">
            <img src={blogthumb_nail} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
