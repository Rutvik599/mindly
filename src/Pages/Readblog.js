import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";
import "../Styles/Readblog.css";
import Header from "../Component/Header";
import { Dot } from "lucide-react";
export default function Readblog() {
  const { currentBlogData } = useContext(blogCurrentData);
  const { currentBlogUserData } = useContext(blogCurrentUserData);
  const [readMin, setReadMin] = useState(0);

  const readMinute = (htmlString) => {
    const strippedString = htmlString.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const words = strippedString.trim().split(/\s+/); // Split by whitespace
    return words.filter((word) => word.length > 0).length; // Filter out empty strings and count
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit" }; // Define options for formatting
    const formattedDate = date.toLocaleDateString("en-US", options); // Format the date

    return formattedDate; // Returns "Oct 10"
  };

  useEffect(() => {
    document.title = currentBlogData.poster_title + " - Mindly";
    console.log("Blog Data", currentBlogData);
    console.log("User Data", currentBlogUserData);
    setReadMin(readMinute(currentBlogData.blog_content));
  }, [currentBlogData, currentBlogUserData]);

  // Here is the return Statement Start
  if (!currentBlogUserData || !currentBlogData) {
    return (
      <div className="loading-read-outer">
        <div className="loading-read-inner"></div>
      </div>
    );
  } else {
    return (
      <>
        <Header />
        <div className="read-outer-div">
          <div className="read-header-part">
            <div className="read-header-title">
              <h1 className="read-title">{currentBlogData.blog_title}</h1>
              <h3 className="read-description">
                {currentBlogData.poster_description}
              </h3>
            </div>
            <div className="user-detail-read-card">
              <img src={currentBlogUserData.profile_pic_url} alt="" />
              <div className="username-follow-button">
                <div className="upper-side">
                  <h3 className="profile-name">
                    {currentBlogUserData.user_name}
                  </h3>
                  <Dot size={15} />
                  <button className="follow-read">Follow</button>
                </div>
                <div className="bottom-side">
                  <h3 className="bottom-read-text">
                    {(readMin / 200).toFixed(0)} min read
                  </h3>
                  <Dot size={10} />
                  <h3 className="uploded-on">
                    {formatDate(currentBlogData.uploded_at)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div
            className="original-part-blog"
            dangerouslySetInnerHTML={{ __html: currentBlogData.blog_content }}
          ></div>

          <div className="tag-read">
            <h1 className="tag-read-text">Tags</h1>
            <h3 className="tags-read">{currentBlogData.blog_related_tag}</h3>
          </div>
          <div className="user-detail-follow">
            <div className="user-detail-bottom-read">
              <img src={currentBlogUserData.profile_pic_url} alt="" />
              <div className="user-bottom">
                <div className="bottom-user-name">
                  <h1 className="profile-name-bottom">
                    {currentBlogUserData.user_name}
                  </h1>
                  <h2 className="bottom-user-desc">
                    {currentBlogUserData.user_profile_description}
                  </h2>
                </div>
                <button className="follow-bottom-read">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
