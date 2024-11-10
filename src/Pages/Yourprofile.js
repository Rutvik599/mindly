import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { auth, db } from "../Backend/firebase-init";
import { getuserDetail } from "../Utils/getuserDetail";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import "../Styles/Yourprofile.css";
import { Ellipsis, EllipsisVertical, Pen } from "lucide-react";
import Publicprofilepost from "../Component/Publicprofilepost";
export default function Yourprofile() {
  const [userprofile, setUserprofile] = useState([]);
  const [userBlog, setUserBlog] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followeeIds, setFolloweeIds] = useState([]);
  const [followeeProfileDetail, setFolloweeProfileDetail] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  const [followerDataIds, setFollowerDataIds] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser.uid) return;
      try {
        const userData = await getuserDetail(auth.currentUser.uid);
        setUserprofile(userData[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const getUserBlog = async () => {
      if (!userprofile.user_id) return;
      const blogCollection = collection(db, "Blog");
      const queryIntent = query(
        blogCollection,
        where("user_id", "==", userprofile.user_id),
        where("blog_status", "==", "Publish")
      );
      const blogDataSnapShots = await getDocs(queryIntent);
      const blogData = blogDataSnapShots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserBlog(blogData);
    };

    const getFolloweeData = async () => {
      if (!userprofile.user_id) return;
      const followeeCollection = collection(db, "Follower");
      const queryIntent = query(
        followeeCollection,
        where("follower_id", "==", userprofile.user_id),
        limit(5)
      );
      const followeeSnapShots = await getDocs(queryIntent);
      const followeeData = followeeSnapShots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFolloweeIds(followeeData);
      console.log("From Follower Table", followeeIds);
    };

    userprofile ? getUserBlog() : console.log("No User Found");
    userprofile ? getFolloweeData() : console.log("No User Found");
  }, [userprofile]);

  useEffect(() => {
    const getAllFollowers = async () => {
      try {
        for (const value of followeeIds) {
          const userData = await getuserDetail(value.followee_id);
          const newUser = userData[0];

          setFolloweeProfileDetail((prev) => {
            // Ensure the new user is not already in the array
            const isUserExists = prev.some(
              (user) => user.user_id === newUser.user_id
            );
            if (!isUserExists) {
              return [...prev, newUser];
            }
            return prev; // If the user already exists, return the previous state
          });
          console.log(followeeProfileDetail); // Note: This might still log stale state because setState is asynchronous
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (followeeIds.length) {
      getAllFollowers();
    } else {
      console.log("No Follower Found");
    }
  }, [followeeIds]);

  const getAllFollowersData = async () => {
    if (!followerData) return;
    try {
      for (const value of followerDataIds) {
        const userData = await getuserDetail(value.follower_id);

        const newUser = userData[0];

        setFollowerData((prev) => {
          // Ensure the new user is not already in the array
          const isUserExists = prev.some(
            (user) => user.user_id === newUser.user_id
          );
          if (!isUserExists) {
            return [...prev, newUser];
          }
          return prev; // If the user already exists, return the previous state
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const getFollowerData = async () => {
    if (!userprofile.user_id) return;
    const followeeCollection = collection(db, "Follower");
    const queryIntent = query(
      followeeCollection,
      where("followee_id", "==", userprofile.user_id),
      limit(5)
    );
    const followeeSnapShots = await getDocs(queryIntent);
    const followeeData = followeeSnapShots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFollowerDataIds(followeeData);
    getAllFollowersData();
  };
  useEffect(() => {}, []);
  const toggleIsFollowing = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      getFollowerData();
    }
  };
  return (
    <>
      <Header />
      <div className="manage-profile-part">
        <div className="manage-profile-left-side">
          {/* This Div is Show the user profile where person can change the user Detail */}
          <div className="profile-upper-part">
            <img src={userprofile.profile_pic_url} alt="" />
            <div className="profile-upper-part-right-side">
              <div className="main-name-profile-upper-part">
                <h1 className="user-name-profile-upper-part">
                  {userprofile.user_name}
                </h1>
                <EllipsisVertical
                  size={20}
                  strokeWidth={1.25}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <p className="profile-upper-part-description">
                {userprofile.user_profile_description}
              </p>
              <button className="manage-profile-edit-profile">
                <Pen size={14} strokeWidth={1.25} />
                Edit Profile
              </button>
            </div>
          </div>
          <div className="manage-profile-bottom-part">
            <p className="user-post-text">Post</p>
            {userBlog.map((blog, index) => (
              <div key={index}>
                <Publicprofilepost blogData={blog} />
              </div>
            ))}
          </div>
        </div>
        <div className="manage-profile-right-side">
          <div className="following-follower-buttons">
            <button
              className={`isFollowing ${isFollowing ? "active" : ""}`}
              onClick={toggleIsFollowing}
            >
              Followers
            </button>
            <button
              className={`isFollowing ${!isFollowing ? "active" : ""}`}
              onClick={toggleIsFollowing}
            >
              Following
            </button>
          </div>
          <div className="bottom-following-follower-part">
            {!isFollowing ? (
              <div className="follower-active">
                {followeeProfileDetail.map((userData, index) => (
                  <div key={index} className="personal-data-user">
                    <img src={userData?.profile_pic_url} alt="random.png" />
                    <div className="user-name-action">
                      <p className="user-name-followee">{userData.user_name}</p>
                      <Ellipsis
                        size={16}
                        strokeWidth={1.25}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                ))}
                {followeeProfileDetail.length <= 0 && (
                  <div className="loader-follower">
                    <p>Look's Like You are No Following Anyone</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="follower">
                {followerData.map((userData, index) => (
                  <div key={index} className="personal-data-user">
                    <img src={userData?.profile_pic_url} alt="random.png" />
                    <div className="user-name-action">
                      <p className="user-name-followee">{userData.user_name}</p>
                      <Ellipsis
                        size={16}
                        strokeWidth={1.25}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                ))}
                {followerData.length <= 0 && (
                  <div className="loader-follower">
                    <p>
                      Looks like no one's following you yet. <br />
                      Keep sharing, and they'll be sure to find you!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
