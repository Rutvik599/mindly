import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../Styles/Newstory.css";
import { Bell, Bold, Code, Ellipsis, Image, Italic, Mic, Quote, Underline } from "lucide-react";

export default function Newstory() {
  const { blogId } = useParams();
  const [username, setUsername] = useState("");
  const [user_img_url, setUserUrl] = useState("");
  const [title, setTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const contentRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const userImage = localStorage.getItem("profile_pic_url");
    setUsername(name);
    setUserUrl(userImage);
  }, []);

  useEffect(() => {
    console.log(blogContent);
  }, [blogContent]);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL", "");
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.style.maxHeight = '400px';
      img.style.display = 'block';
      img.style.margin = '5px auto';
      contentRef.current.appendChild(img);
      
      const lineBreak = document.createElement('br');
      contentRef.current.appendChild(lineBreak);
      handleInput();
      setTimeout(() => {
        moveCursorAfterElement(lineBreak);
      }, 0);
    }
  };

  const moveCursorAfterElement = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStartAfter(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const convertToCode = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText) {
      const pre = document.createElement('pre');
      pre.textContent = selectedText;

      // Replace selected text with the code block
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(pre);
      handleInput();

      // Move the cursor after the new <pre> element
      moveCursorAfterElement(pre);
    }
  };

  const handleInput = () => {
    setBlogContent(contentRef.current.innerHTML);
    const hasContent = contentRef.current.innerText.trim() !== "" || 
                       contentRef.current.querySelector('img') !== null;

    if (!hasContent) {
      contentRef.current.classList.remove("has-content");
    } else {
      contentRef.current.classList.add("has-content");
    }
  };

  const handleKeyDown = (e) => {
    // Check if cursor is inside a <pre> element
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const parentElement = range.startContainer.parentNode;

    // If inside a <pre> tag, handle the Enter key to create a new line
    if (parentElement.tagName === 'PRE' && e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior (new line)

      const newLine = document.createElement('div'); // Create a new line
      newLine.innerHTML = '&nbsp;'; // Add a non-breaking space for visibility
      parentElement.parentNode.insertBefore(newLine, parentElement.nextSibling); // Insert new line after <pre>

      moveCursorAfterElement(newLine); // Move the cursor to the new line
    }
  };

  return (
    <div className="main-story-write-page">
      <div className="header-story-write">
        <div className="left-side-story-header">
          <h1 className="sitename" onClick={() => navigate("/")}>
            Mindly
          </h1>
          <h4 className="draft-saved-text">Draft in {username}</h4>
        </div>
        <div className="right-side-story-header">
          <button className="publishtag">Publish</button>
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          contentEditable
          ref={contentRef}
          className="blog-actual-content"
          placeholder="Express Your Emotions..."
          onInput={handleInput}
          onKeyDown={handleKeyDown} // Add key down handler
        ></div>
      </div>
      <div className="inpputedit">
        <Bold size={20} strokeWidth={1.5} onClick={() => formatText("bold")} />
        <Italic size={20} strokeWidth={1.5} onClick={() => formatText("italic")} />
        <Underline size={20} strokeWidth={1.5} onClick={() => formatText("underline")} />
        <Quote size={20} strokeWidth={1.5} fill="currentColor" onClick={() => formatText("formatBlock", "blockquote")} />
        <Image size={20} strokeWidth={1.5} onClick={insertImage} />
        <Link size={20} strokeWidth={1.5} onClick={() => formatText("createLink", prompt("Enter URL", ""))}/>
        <Code size={20} strokeWidth={1.5} onClick={convertToCode}/>
        <Mic size={20} strokeWidth={1.5}/>
      </div>
    </div>
  );
}
