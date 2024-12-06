import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import { auth, db } from "../Backend/firebase-init";
import { getuserDetail } from "../Utils/getuserDetail";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import "../Styles/Yourprofile.css";
import { Ellipsis, EllipsisVertical, Pen, X } from "lucide-react";
import Publicprofilepost from "../Component/Publicprofilepost";
import { toast, ToastContainer } from "react-toastify";
export default function Yourprofile() {
  const [userprofile, setUserprofile] = useState([]);
  const [userBlog, setUserBlog] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followeeIds, setFolloweeIds] = useState([]);
  const [followeeProfileDetail, setFolloweeProfileDetail] = useState([]);
  const [followerData, setFollowerData] = useState([]);
  const [followerDataIds, setFollowerDataIds] = useState([]);
  const [isPost, setIsPost] = useState(true);
  const [saveData, setsaveData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUsername, setnewUsername] = useState("");
  const [newDescription, setnewDescription] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser?.uid) return;
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
        where("user_id", "==", auth.currentUser.uid),
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
    };

    userprofile ? getUserBlog() : console.log("No User Found");
    userprofile ? getFolloweeData() : console.log("No User Found");
    setnewUsername(userprofile.user_name);
    setnewDescription(userprofile.user_profile_description);
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

  const toggleIsFollowing = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      getFollowerData();
    }
  };

  const savedBlog = async (blogId) => {
    try {
      const blogRef = collection(db, "Blog"); // Correctly reference the collection
      const q = query(blogRef, where("blog_id", "in", blogId)); // Create a query
      const docData = await getDocs(q);
      const data = docData.docs.map((doc) => doc.data());
      /*  console.log("This is what data is", typeof userBlog);
      console.log("This is what we have", typeof data); */

      setsaveData(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const loadSavedData = async () => {
    if (!userprofile.saveList) return;

    savedBlog(userprofile.saveList);
  };

  const updateProfile = async () => {
    if (!newUsername || !newDescription) return;

    if (
      newUsername === userprofile.user_name &&
      newDescription === userprofile.user_profile_description
    ) {
      toast.error(
        `Oops! Looks like you haven't made any changes to your profile yet.`
      );

      return;
    }
    const updateData = {};
    if (newUsername !== userprofile.user_name) {
      updateData.user_name = newUsername;
    }

    if (newDescription !== userprofile.user_profile_description) {
      updateData.user_profile_description = newDescription;
    }

    const updatedDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      await updateDoc(updatedDocRef, updateData);
      window.location.reload();
    } catch (error) {
      console.log("ERROR-UPDATING-PROFILE", error.message);
    }
  };
  return (
    <>
      <ToastContainer
        style={{
          fontFamily: "Poppins",
          fontSize: "14px",
        }}
        autoClose={2000}
      />
      {isDialogOpen && (
        <div className="dialog-backdrop" onClick={() => setIsDialogOpen(false)}>
          <div
            className="dialogbox-profile"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="site-name-from-side-bar">
              <h2 className="sitename" style={{ margin: "0px" }}>
                Mindly
              </h2>
              <X
                size={20}
                strokeWidth={1.25}
                onClick={() => setIsDialogOpen(false)}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="changeusername">
              <p className="laber-for-input">Email Address</p>
              <input
                type="text"
                value={auth.currentUser.email}
                disabled
                style={{ cursor: "no-drop" }}
              />
            </div>
            <div className="changeimage">
              <p className="laber-for-input">Profile Picture</p>
              <img
                src={userprofile.profile_pic_url}
                alt={`${userprofile.user_name}.jpge`}
                style={{ cursor: "no-drop" }}
              />
            </div>
            <div className="changeusername">
              <p className="laber-for-input">Username</p>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setnewUsername(e.target.value)}
              />
            </div>
            <div className="changeusername">
              <p className="laber-for-input">Description</p>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setnewDescription(e.target.value)}
              />
            </div>
            <div className="comment-edit-button">
              <button className="edit-comment-button" onClick={updateProfile}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* this is the main page */}
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
              <button
                className="manage-profile-edit-profile"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pen size={14} strokeWidth={1.25} />
                Edit Profile
              </button>
            </div>
          </div>
          <div className="manage-profile-bottom-part">
            <div className="post-and-savelist-user">
              <button
                className={`visible-post-buttons ${
                  isPost ? "active-button-post" : ""
                }`}
                onClick={() => setIsPost(true)}
              >
                Post
              </button>
              <button
                className={`visible-post-buttons ${
                  !isPost ? "active-button-post" : ""
                }`}
                onClick={() => {
                  setIsPost(false);
                  loadSavedData();
                }}
              >
                Saved
              </button>
            </div>
            {isPost
              ? userBlog.map((blog, index) => (
                  <div key={index}>
                    <Publicprofilepost blogData={blog} userData={userprofile} />
                  </div>
                ))
              : saveData.map((blog, index) => (
                  <div key={index}>
                    <Publicprofilepost
                      blogData={blog}
                      isSaved={true}
                      userData={userprofile}
                    />
                  </div>
                ))}

            {isPost && userBlog.length <= 0 && (
              <div className="no-data-found">
                <p>Oops! It seems like you haven't shared anything yet.</p>
              </div>
            )}

            {!isPost && saveData.length <= 0 && (
              <div className="no-data-found">
                <p>Oops! It seems like you haven't shared anything yet.</p>
              </div>
            )}
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
