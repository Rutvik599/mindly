import React, { useEffect, useState } from "react";
import "../Styles/Userprofile.css";
import { getDoc, doc, setDoc } from "firebase/firestore"; // Firestore import
import { auth, db } from "../Backend/firebase-init";
import { useNavigate } from "react-router-dom";
import img from "../Utils/profilepicture.png";
import { toast, ToastContainer } from "react-toastify";
import { blogTags } from "../Utils/tags.js";
import { Loader2 } from "lucide-react";

export default function Userprofile({ setLoading }) {
  // Initialization of the Data
  const [selectedTags, setSelectedTags] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isTagsEnabled, setTagEnabled] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(img);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        console.log(user.uid);
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("user_name", data.user_name);
            localStorage.setItem(
              "user_profile_description",
              data.user_profile_description
            );
            setUserData({
              user_id: data.user_id,
              user_name: data.user_name,
              user_profile_description: data.user_profile_description,
            });
            // setLoading();
            // navigate("/");
          } else {
            console.log("No such user data found!");
          }
        } else {
          console.log("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result); // Set profile picture URL to local file
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(
      (prev) =>
        prev.includes(tag)
          ? prev.filter((t) => t !== tag) // Remove tag if already selected
          : [...prev, tag] // Add tag if not selected
    );
  };

  const setTagEnagle = () => {
    if (!name || !description || !profilePicUrl) {
      toast.error("Fields Cannot be Empty");
      return;
    } else {
      setTagEnabled(true);
    }
  };

  const storeIntoDatabase = async () => {
    isLoading(true);
    if (selectedTags.length < 5) {
      toast.error("Select Minimum 5 Tags");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid); // Reference to the user's document

        await setDoc(userDocRef, {
          user_id: auth.currentUser.uid,
          user_name: name,
          user_profile_description: description,
          profile_pic_url: profilePicUrl,
          user_interested_tags: selectedTags, // Add the selected tags here
        });

        // Store profile data in local storage
        localStorage.removeItem("newUser");
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_profile_description", description);
        localStorage.setItem("profile_pic_url", profilePicUrl);
        localStorage.setItem("user_interested_tags", selectedTags);

        toast.success("Profile Created successfully!");
        setLoading();
        navigate("/");
      } else {
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error storing data:", error);
      toast.error("Error updating profile.");
    }
    isLoading(false);
  };

  // Actual Html
  return (
    <>
      <ToastContainer
        style={{
          fontFamily: "Roboto",
          fontSize: "14px",
        }}
      />

      <div className={`commonbutton ${isTagsEnabled ? "show" : ""}`}>
        <h1 className="sitename">Mindly</h1>
        <h3 className="setuprofiletext">Select Your Interested Tag</h3>
        <div className="selectTag">
          {blogTags.map((tag, index) => (
            <button
              key={index}
              className={`tagItem ${
                selectedTags.includes(tag) ? "active" : ""
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="continuebutton1">
          <button
            className="continue"
            type="button"
            onClick={storeIntoDatabase}
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {!loading ? (
              "Continue"
            ) : (
              <Loader2
                size={15}
                style={{ color: "white" }}
                className="loader"
              />
            )}
          </button>
        </div>
      </div>
      <div className={`setupyourprofile ${!isTagsEnabled ? "show" : ""}`}>
        <h1 className="sitename">Mindly</h1>
        <h3 className="setuprofiletext">Update Your Profile</h3>
        <div className="profileactualdetail">
          <div
            className="profilepicture-container"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <img src={profilePicUrl} alt="Profile" className="profilepicture" />
          </div>
          <div className="nameanddescription">
            <input
              type="text"
              className="name"
              placeholder="Profile Name"
              value={name}
              onChange={handleNameChange}
            />
            <input
              type="text"
              className="description"
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
            />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>
        </div>
        <div className="continuebutton">
          <button className="continue" onClick={setTagEnagle}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
