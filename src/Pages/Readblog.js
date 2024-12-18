import React, { useContext, useEffect, useState } from "react";
import { blogCurrentData, blogCurrentUserData } from "../Utils/context";
import "../Styles/Readblog.css";
import Header from "../Component/Header";
import { Dot, Heart, MessageCircle } from "lucide-react";
import { checkfollow, followpage } from "../Utils/Followpage";
import { auth, db } from "../Backend/firebase-init";
import { unfollow } from "../Utils/Unfollowpage";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import useCommentStore from "../Utils/useCommentStore.js";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getuserDetail } from "../Utils/getuserDetail.js";
export default function Readblog() {
  const { currentBlogData, setCurrentBlogData } = useContext(blogCurrentData);
  const { currentBlogUserData, setCurrentBlogUserData } =
    useContext(blogCurrentUserData);
  const [readMin, setReadMin] = useState(0);
  const [isFollow, setIsfollow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isFilled, setIsFilled] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { commentIds } = useCommentStore();
  const { username, blogcontent } = useParams();
  const [isLodaing, setIsLoading] = useState(false);
  const getBlogDetail = async () => {
    const blogId = blogcontent.split("-").pop();
    const blogRef = collection(db, "Blog");
    const blogIntent = query(blogRef, where("blog_id", "==", blogId));
    const querySnapshot = await getDocs(blogIntent);

    if (!querySnapshot.empty) {
      const blogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentBlogData(blogData);
      const userDetailBlog = getuserDetail(blogData.user_id);
      setCurrentBlogUserData(userDetailBlog);
    }
  };

  useEffect(() => {
    const blogId = blogcontent.split("-").pop();
    console.log("USERNAME", username, "\nBLOG_CONTENT", blogId);
    console.log(currentBlogData);

    if (!currentBlogData) {
      getBlogDetail();
    }
  }, []);

  useEffect(() => {
    if (!auth.currentUser?.uid || !currentBlogData) return;

    if (currentBlogData.liked?.includes(auth.currentUser.uid)) {
      setIsFilled(true);
    }

    setLikeCount(currentBlogData.liked?.length);

    const checkfollowuse = async () => {
      if (!auth.currentUser.uid || !currentBlogUserData.id) return;
      const result_check_follow = await checkfollow(
        auth.currentUser.uid,
        currentBlogUserData.id
      );

      result_check_follow ? setIsfollow(true) : setIsfollow(false);
    };

    checkfollowuse();
  }, [currentBlogUserData, currentBlogData]);

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

  const addIntoLike = async () => {
    const currentUser = auth.currentUser.uid;
    const updateLikeRef = doc(db, "Blog", currentBlogData.blog_id);
    await updateDoc(updateLikeRef, {
      liked: isFilled ? arrayRemove(currentUser) : arrayUnion(currentUser),
    });
    setIsFilled((prev) => !prev);

    isFilled
      ? setLikeCount((prev) => prev - 1)
      : setLikeCount((prev) => prev + 1);
  };

  // Here is the return Statement Start
  if (isLodaing) {
    return (
      <div className="loading-read-outer">
        <div className="loading-read-inner"></div>
      </div>
    );
  } else {
    return (
      <>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          blog_id={currentBlogData.blog_id}
        />
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
                    {(readMin / 200).toFixed(0) > 0
                      ? (readMin / 200).toFixed(0)
                      : 1}{" "}
                    min read
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
              <div className="icon-container" onClick={addIntoLike}>
                <Heart
                  className={`icon ${isFilled ? "filled" : "outlined"}`}
                  size={20}
                />
              </div>
              <p className="like-count-read-blog">{likeCount}</p>
            </div>
            <div className="like-post">
              <MessageCircle
                strokeWidth={1.25}
                size={20}
                onClick={toggleSidebar}
              />
              {commentIds?.length ? commentIds?.length : "0"}
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
