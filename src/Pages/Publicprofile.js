import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Backend/firebase-init";
import { collection, query, limit, where, getDocs } from "firebase/firestore";
import "../Styles/Publicprofile.css";
import Publicprofilepost from "../Component/Publicprofilepost";
import { ArrowLeft } from "lucide-react";
import { auth } from "../Backend/firebase-init";
import { unfollow } from "../Utils/Unfollowpage";
import { checkfollow, followpage } from "../Utils/Followpage";
export default function Publicprofile() {
  const [isFollow, setIsFollow] = useState(false);
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // Fetch user data from Firestore
  useEffect(() => {
    document.title = `${username} - Profile - Mindly`;
    const fetchUser = async () => {
      try {
        const UserProfileRef = collection(db, "users");
        const queryIntent = query(
          UserProfileRef,
          where("user_name", "==", username)
        );
        const documentSnapshots = await getDocs(queryIntent);
        const userData = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUser(userData[0]); // Set the first (and expected only) user document
      } catch (error) {
        console.log("Error fetching user profile:", error.message);
      }
    };

    fetchUser();
  }, [username]);

  // Fetch blogs based on the fetched user's data
  useEffect(() => {
    const fetchBlogs = async () => {
      if (user && user.user_id) {
        // Only fetch blogs when user data is available
        try {
          const blogsRef = collection(db, "Blog");
          const q = query(
            blogsRef,
            where("user_id", "==", user?.user_id),
            where("blog_status", "==", "Publish"),
            limit(5)
          );

          const querySnapshot = await getDocs(q);
          const fetchedBlogs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setBlogs(fetchedBlogs);
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      }
    };

    const checkfollowuse = async () => {
      const result_check_follow = await checkfollow(
        auth.currentUser.uid,
        user.user_id
      );
      console.log(result_check_follow);

      result_check_follow ? setIsFollow(true) : setIsFollow(false);
    };

    fetchBlogs();
    user ? checkfollowuse() : console.log("No user Found");
  }, [user]); // Fetch blogs only when `user` changes

  const followWork = async () => {
    const result_follow = followpage(auth.currentUser.uid, user.user_id);
    result_follow ? setIsFollow(true) : setIsFollow(false);
  };

  const unFollowWork = async () => {
    const result_unfollow = unfollow(auth.currentUser.uid, user.user_id);
    if (result_unfollow) {
      setIsFollow(false);
    } else {
      setIsFollow(true);
    }
  };

  const gotohome = () => {
    navigate("/");
  };
  // Render
  return user ? (
    <div className="public-profile-user">
      <ArrowLeft className="backtohome-arrow-left" onClick={gotohome} />
      <div className="user-display-public">
        <div className="left-profile-public">
          <img src={user?.profile_pic_url} alt="" />
          <div className="user-text-content">
            <h2 className="user-username-text-content">{user?.user_name}</h2>
            <p className="user-user-description-text-content">
              {user?.user_profile_description}
            </p>
          </div>
        </div>
        {!isFollow ? (
          <button className="follow-bottom-public-profile" onClick={followWork}>
            Follow
          </button>
        ) : (
          <button className="already-follow" onClick={unFollowWork}>
            Following
          </button>
        )}
      </div>

      <div className="blogs-list">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="blog-item-search">
              <Publicprofilepost blogData={blog} />
            </div>
          ))
        ) : (
          <p>No Data found from "{username}".</p>
        )}
      </div>
    </div>
  ) : (
    <div className="user-not-found">
      <h1 className="user-not-found-text">Opps! Wrong Person</h1>
      <p className="gototext">
        It's okay to be on the wrong page! Let me guide you in the right
        direction.
      </p>
      <button onClick={gotohome} className="goto-home-public-button">
        Homepage
      </button>
    </div>
  );
}
