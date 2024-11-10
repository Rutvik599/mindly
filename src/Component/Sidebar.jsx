import React, { useState, useRef, useEffect } from "react";
import "../Styles/Sidebar.css";
import { ChevronDown, Trash2, X } from "lucide-react";
import { auth } from "../Backend/firebase-init";
import { getuserDetail } from "../Utils/getuserDetail";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openDiv, setOpenDiv] = useState(false);
  const contentRef = useRef(null);
  const [myName, setMyname] = useState("");
  const [selected, setSelected] = useState("Most Recent");
  const [showOptions, setShowOptions] = useState(false); // Define the state for showing options
  const options = ["Most Recent", "Most Liked", "Oldest One"];
  const [commentValue, setCommentValue] = useState("");
  const [commentFinalResult, setCommentFinalResult] = useState([]);

  const toggleOpenbar = () => {
    if (!openDiv) {
      setOpenDiv(true);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getuserDetail(auth.currentUser.uid);
        setMyname(userData[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Here this function add Comments into Database , Temporary this will add the comments into the Array

  const addComment = () => {
    setCommentValue("");
    setCommentFinalResult((prevComments) => [...prevComments, commentValue]);
  };

  const removeFromComment = (index) => {
    setCommentFinalResult(
      (prevComments) => prevComments.filter((_, i) => i !== index) // Filter out the comment at the provided index
    );
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="response-top-sidebar-div">
        <h1 className="top-response-text-sidebar">
          Comment({commentFinalResult.length})
        </h1>
        <button className="close-btn" onClick={toggleSidebar}>
          <X strokeWidth={1.25} size={20} />
        </button>
      </div>

      <div className="sidebar-content">
        {/* This Section is for input in which we have to write comment */}
        <div
          className={`div-open-expand ${openDiv ? "expanded" : ""}`}
          onClick={toggleOpenbar}
          ref={contentRef}
        >
          {openDiv && (
            <div className="upper-part-of-the-comment">
              <img src={myName.profile_pic_url} alt="user.png" />
              <p>{myName.user_name}</p>
            </div>
          )}
          <input
            type="text"
            value={commentValue}
            onChange={(e) => {
              setCommentValue(e.target.value);
            }}
            placeholder="Leave Comment for Author"
            onFocus={() => setOpenDiv(true)}
          />
          {openDiv && (
            <div className="bottom-part-of-the-comment">
              <button className="cancel" onClick={() => setOpenDiv(false)}>
                Cancel
              </button>
              <button className="comment" onClick={addComment}>
                Comment
              </button>
            </div>
          )}
        </div>
        {/* This is Drop down that Filter the Comment Section which is Shown */}
        <div className="drop-down-most-recent-tag">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="dropdown-button"
          >
            {selected} <ChevronDown size={20} strokeWidth={1.5} />
          </button>

          {showOptions && (
            <div className="dropdown-options">
              {options.map((option) => (
                <div
                  key={option}
                  className="dropdown-option"
                  onClick={() => {
                    setSelected(option);
                    setShowOptions(false); // Close dropdown after selection
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="actual-visible-comment">
          {commentFinalResult.map((comment, index) => (
            <div className="comment-value" key={index}>
              <p className="comment-p-value">{comment}</p>
              <Trash2
                size={16}
                strokeWidth={1.25}
                onClick={() => removeFromComment(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
