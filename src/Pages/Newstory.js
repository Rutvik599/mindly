import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/Newstory.css"; // Ensure your styles are correctly set up
import { Bell, Ellipsis, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { blogTags } from "../Utils/tags.js";

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

  const toolbarOptions = [
    ["bold", "italic", "link", "image", "blockquote", "code-block"],
  ];
  const quillRef = useRef(null); // Use ref to access the ReactQuill instance

  const module = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const userImage = localStorage.getItem("profile_pic_url");
    setUsername(name);
    setUserUrl(userImage);
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input) {
      setShowDropdown(true); // Show the dropdown when there's input
    } else {
      setShowDropdown(false); // Hide the dropdown when input is empty
    }

    // Filter the tags based on the search input
    const filtered = blogTags.filter((tag) =>
      tag.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredTags(filtered); // Update the filtered tags
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

  // useEffect to update previewText whenever the value prop changes
  useEffect(() => {
    const extractedText = getFirst150Characters(value); // Get the first 150 characters
    setPreviewText(extractedText); // Update state with the extracted text
  }, [value]);

  const setPublishTitle = (e) => {
    settitlePublish(e.target.value);
  };
  const Titlechange = (e) => {
    setTitle(e.target.value);
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

  return (
    <>
      {isPublish ? (
        <div className="publish">
          <div className="preview">
            <p className="previewtext">Preview </p>
            <p className="storyheader">{title}</p>
            <div
              className="content"
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
            <button className="publishtag1">Publish Now</button>
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
            </div>
            <div className="right-side-story-header">
              <button className="publishtag" onClick={submitBlog}>
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
