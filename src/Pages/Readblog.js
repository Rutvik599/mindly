import React, { useContext, useEffect, useState } from "react";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";
import "../Styles/Readblog.css";
import Header from "../Component/Header";
import { Dot, Heart, MessageCircle } from "lucide-react";
import { checkfollow, followpage } from "../Utils/Followpage";
import { auth } from "../Backend/firebase-init";
import { unfollow } from "../Utils/Unfollowpage";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
export default function Readblog() {
  const { currentBlogData } = useContext(blogCurrentData);
  const { currentBlogUserData } = useContext(blogCurrentUserData);
  const [readMin, setReadMin] = useState(0);
  const [isFollow, setIsfollow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkfollowuse = async () => {
      const result_check_follow = await checkfollow(
        auth.currentUser.uid,
        currentBlogUserData.id
      );

      result_check_follow ? setIsfollow(true) : setIsfollow(false);
    };

    checkfollowuse();
  }, [currentBlogUserData.id]);

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
    //console.log("Blog Data", currentBlogData);
    //console.log("User Data", currentBlogUserData);
    setReadMin(readMinute(currentBlogData.blog_content));
  }, [currentBlogData, currentBlogUserData]);

  // This function is used when Follow Button is Clicked
  const followWork = async () => {
    const result_follow = followpage(
      auth.currentUser.uid,
      currentBlogUserData.id
    );
    result_follow ? setIsfollow(true) : setIsfollow(false);
  };

  // This Function is used when Following Button is Clicked
  const unFollowWork = async () => {
    const result_unfollow = unfollow(
      auth.currentUser.uid,
      currentBlogUserData.id
    );
    if (result_unfollow) {
      setIsfollow(false);
    } else {
      setIsfollow(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
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
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
                  {!isFollow ? (
                    <button className="follow-read" onClick={followWork}>
                      Follow
                    </button>
                  ) : (
                    <button className="follow-read" onClick={unFollowWork}>
                      Following
                    </button>
                  )}
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
            <h3
              className="tags-read"
              onClick={() =>
                navigate(`/searchresult/${currentBlogData.blog_related_tag}`)
              }
            >
              {currentBlogData.blog_related_tag}
            </h3>
          </div>
          <div className="bottom-read-blog-comment-like-section">
            <div className="like-post">
              <Heart size={20} strokeWidth={1.25} />
              <p className="like-post-text">0</p>
            </div>
            <div className="like-post" onClick={toggleSidebar}>
              <MessageCircle strokeWidth={1.25} size={20} />
              <p className="like-posst-text">0</p>
            </div>
          </div>
          <div className="user-detail-follow">
            <div className="user-detail-bottom-read">
              <img src={currentBlogUserData.profile_pic_url} alt="" />
              <div className="user-bottom">
                <div
                  className="bottom-user-name"
                  onClick={() =>
                    navigate(`/search/profile/${currentBlogUserData.user_name}`)
                  }
                >
                  <h1 className="profile-name-bottom">
                    {currentBlogUserData.user_name}
                  </h1>
                  <h2 className="bottom-user-desc">
                    {currentBlogUserData.user_profile_description}
                  </h2>
                </div>
                {!isFollow ? (
                  <button className="follow-bottom-read" onClick={followWork}>
                    Follow
                  </button>
                ) : (
                  <button className="already-follow" onClick={unFollowWork}>
                    Following
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
