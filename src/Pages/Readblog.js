import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";

export default function Readblog() {
  const { currentBlogData } = useContext(blogCurrentData);
  const { currentBlogUserData } = useContext(blogCurrentUserData);

  useEffect(() => {
    console.log("Blog Data", currentBlogData);
    console.log("User Data", currentBlogUserData);
  }, [currentBlogData, currentBlogUserData]);
  return (
    <div>
      <h4>This blog is written by {currentBlogData?.blog_title}</h4>
      <h4>Blog title is</h4>
    </div>
  );
}
