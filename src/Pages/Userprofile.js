import React, { useEffect, useState } from "react";
import "../Styles/Userprofile.css";
import { getDoc, doc, setDoc } from "firebase/firestore"; // Firestore import
import { auth, db } from "../Backend/firebase-init";
import { useNavigate } from "react-router-dom";
import img from "../Utils/profilepicture.png";
import { toast, ToastContainer } from "react-toastify";
export default function Userprofile({ setLoading }) {
  // Initialization of the Data
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(img);
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
            setLoading();
            navigate("/");
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

  const storeIntoDatabase = async () => {
    if (!name || !description || !profilePicUrl) {
      toast.error("Fields Cannot be Empty");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
  
        await setDoc(userDocRef, {
          user_name: name,
          user_profile_description: description,
          profile_pic_url: profilePicUrl
        });
  
        // Store profile data in local storage
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_profile_description', description);
        localStorage.setItem('profile_pic_url', profilePicUrl);
  
        toast.success("Profile Created successfully!");
        navigate('/');
      } else {
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error storing data:", error);
      toast.error("Error updating profile.");
    }
  };
  

  // Actual Html
  return (<>
  <ToastContainer style={{
          fontFamily: 'Roboto',
          fontSize: '14px'
        }}/>
    <div className="setupyourprofile">
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
        <button className="continue" onClick={storeIntoDatabase}>Continue</button>
      </div>
    </div>
    </>
  );
}
