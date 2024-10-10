import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/Newstory.css"; // Ensure your styles are correctly set up
import { Bell, Ellipsis, Mic, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { blogTags } from "../Utils/tags.js";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { auth, db } from "../Backend/firebase-init.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
export default function Newstory() {
  const { blogId } = useParams();
  const [username, setUsername] = useState("");
  const [user_img_url, setUserUrl] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [isPublish, setisPublish] = useState(false);
  const [titlePublish, settitlePublish] = useState(title);
  const [previewText, setPreviewText] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Holds the input value
  const [filteredTags, setFilteredTags] = useState(blogTags); // Holds the filtered tags
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutIdRef = useRef(null);
  const [savedText, setsavedText] = useState(false);
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const toolbarOptions = [
    ["bold", "italic", "link", "image", "blockquote", "code-block"],
  ];
  const quillRef = useRef(null);

  const module = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const userImage = localStorage.getItem("profile_pic_url");
    setUsername(name);
    setUserUrl(userImage);

    const fetchBlogData = async () => {
      try {
        const blogDocRef = doc(db, "Blog", blogId); // Replace 'db' with your Firestore instance
        const blogDoc = await getDoc(blogDocRef);

        if (blogDoc.exists()) {
          const jsonData = blogDoc.data(); // Fetch the document data

          const currentUser = auth.currentUser;
          if (currentUser && jsonData.user_id) {
            if (currentUser.uid !== jsonData.user_id) {
              navigate("/");
            } else {
              console.log(jsonData);
              setTitle(jsonData.blog_title);
              setValue(jsonData.blog_content);
            }
          } else {
            console.error("No user data found or user is not logged in.");
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching blog data: ", error);
      }
    };

    fetchBlogData();
  }, [blogId, navigate]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }

    const filtered = blogTags.filter((tag) =>
      tag.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTags(filtered);
  };

  const handleTagSelect = (tag) => {
    setSearchTerm(tag); // Set the selected tag as the input value
    setShowDropdown(false); // Hide the dropdown after selection
  };

  const getFirst150Characters = (htmlContent) => {
    const tempDiv = document.createElement("div"); // Create a temporary div to parse HTML
    tempDiv.innerHTML = htmlContent; // Set the innerHTML to the dangerous HTML
    const textContent = tempDiv.textContent || tempDiv.innerText || ""; // Extract plain text content

    return textContent.length > 200
      ? textContent.substring(0, 200)
      : textContent; // Return first 150 characters
  };

  const storeBlogAsDraft = async () => {
    try {
      setsavedText(true);
      const user = auth.currentUser;
      const blogDocRef = doc(db, "Blog", blogId);

      const blogData = {
        blog_id: blogId,
        user_id: user.uid,
        blog_title: title,
        blog_content: value,
        blog_status: "Draft",
        created_at: new Date().toISOString(),
      };

      await setDoc(blogDocRef, blogData);

      console.log("Blog draft saved successfully");
    } catch (error) {
      console.error("Error saving blog draft:", error);
    }

    setTimeout(() => {
      setsavedText(false);
    }, 1000);
  };

  useEffect(() => {
    // Clear the previous timeout if it's still active
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // Set a new timeout to call the API after a delay (e.g., 2000ms = 2 seconds)
    timeoutIdRef.current = setTimeout(() => {
      storeBlogAsDraft(); // Call the function to save the draft
    }, 1000);

    // Set the preview text based on the first 150 characters
    const extractedText = getFirst150Characters(value);
    setPreviewText(extractedText);

    // Cleanup function to clear the timeout when value changes or component unmounts
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [value]);

  const setPublishTitle = (e) => {
    settitlePublish(e.target.value);
  };

  const Titlechange = (e) => {
    const value = e.target.value;

    // Clear the previous timeout if it's still active
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // Set a new timeout to call the API after a delay (e.g., 2000ms = 2 seconds)
    timeoutIdRef.current = setTimeout(() => {
      storeBlogAsDraft(); // Call the function to save the draft
    }, 2000);

    // Update the title and call other necessary functions
    setTitle(value);
    setPublishTitle(e);
  };

  const submitBlog = () => {
    setisPublish(true);
    console.log(value);
  };

  const getFirstImageSrc = (htmlContent) => {
    const tempDiv = document.createElement("div"); // Create a temporary div
    tempDiv.innerHTML = htmlContent; // Set the innerHTML to the HTML content
    const img = tempDiv.querySelector("img"); // Find the first <img> tag
    return img ? img.src : ""; // Return the src or an empty string if no img found
  };

  const firstImageSrc = getFirstImageSrc(value);

  const startContinuousListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      alert("This Browser Not Support This Functionality");
    }
  };

  useEffect(() => {
    setValue(transcript);
  }, [transcript]);

  const saveAsBlog = async () => {
    try {
      const blogDocRef = doc(db, "Blog", blogId);

      const blogData = {
        blog_title: title,
        blog_content: value,
        poster_title: titlePublish,
        poster_description: previewText,
        blog_related_tag: searchTerm,
        blog_status: "Publish",
        uploded_at: new Date().toISOString(),
      };

      await setDoc(blogDocRef, blogData, { merge: true });

      console.log("Blog draft saved successfully");

      navigate("/");
    } catch (error) {
      console.error("Error saving blog draft:", error);
    }
  };

  return (
    <>
      {isPublish ? (
        <div className="publish">
          <div className="preview">
            <p className="previewtext">Preview </p>
            <p className="storyheader">{title}</p>
            <div
              className="content-decs"
              dangerouslySetInnerHTML={{ __html: value }}
            ></div>
          </div>
          <div className="final">
            <div className="storyposter">
              <p className="storypostertext">Story Poster</p>
              {firstImageSrc ? (
                <img
                  src={firstImageSrc}
                  alt="Story Preview"
                  className="storyimage"
                />
              ) : (
                <div className="storydiv">
                  No image available for display. Please consider adding an
                  image to enhance your content.
                </div>
              )}
            </div>
            <div className="storyheaderview">
              <input
                className="storyheadertext"
                value={titlePublish}
                onChange={setPublishTitle}
              />
              <textarea
                className="storyfirsttext"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                style={{ resize: "none", overflow: "hidden" }} // Disable manual resizing and hide scroll
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height dynamically based on content
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent the default action of adding a new line
                  }
                }}
              />
            </div>
            <div className="publishing">
              <p className="publishingtext">Publishing to {username}</p>
              <p className="addtopic">
                Add Topics to Help Users Find Your Content Seamlessly and
                Easily.
              </p>
              <div className="tag-dropdown-container">
                <input
                  type="text"
                  className="storyfirsttext1"
                  placeholder="Search Tags"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                {/* Only show the dropdown when there's input and the dropdown is set to be visible */}
                {showDropdown && filteredTags.length > 0 && (
                  <ul className="tag-dropdown">
                    {filteredTags.map((tag, index) => (
                      <li
                        key={index}
                        className="tag-dropdown-item"
                        onClick={() => handleTagSelect(tag)} // Select the tag
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              className="publishtag1"
              onClick={saveAsBlog}
              disabled={
                !searchTerm ||
                titlePublish.length < 10 ||
                previewText.length < 20
              }
            >
              Publish Now
            </button>
          </div>

          <X
            color="#676767"
            className="back"
            onClick={() => setisPublish(false)}
          />
        </div>
      ) : (
        <div className="main-story-write-page">
          <div className="header-story-write">
            <div className="left-side-story-header">
              <h1 className="sitename" onClick={() => navigate("/")}>
                Mindly
              </h1>
              <h4 className="draft-saved-text">Draft in {username}</h4>

              {savedText ? <h4 className="saved-text">Saved</h4> : null}
            </div>
            <div className="right-side-story-header">
              {!listening ? (
                <Mic
                  size={20}
                  color="#676767"
                  strokeWidth={1.5}
                  onClick={startContinuousListening}
                />
              ) : (
                <div
                  onClick={SpeechRecognition.stopListening}
                  className="loader1"
                >
                  <span className="stroke"></span>
                  <span className="stroke"></span>
                  <span className="stroke"></span>
                  <span className="stroke"></span>
                  <span className="stroke"></span>
                </div>
              )}{" "}
              {/* Using This Button We can Listen and Stop the Recording*/}
              <button
                className="publishtag"
                onClick={submitBlog}
                disabled={title.length < 10 || value.length < 30}
              >
                Publish
              </button>
              <Ellipsis size={20} color="#676767" />
              <Bell size={20} strokeWidth={1.5} color="#676767" />
              <img src={user_img_url} alt="" className="user-profile-pic-url" />
            </div>
          </div>

          <div className="actual-writing-content">
            <input
              type="text"
              value={title}
              className="blog-title-text-input"
              placeholder="Title"
              onChange={Titlechange}
            />

            {/* Custom Toolbar */}
          </div>
          {/* Editor Component */}
          <ReactQuill
            className="richtexteditor"
            ref={quillRef} // Attach the ref to ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={module}
            style={{ fontFamily: "'IBM Plex Serif', serif" }}
          />
        </div>
      )}
    </>
  );
}
