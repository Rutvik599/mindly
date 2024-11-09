import React from "react";
import "../Styles/Sidebar.css";
import { MessageCircle, X } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        <X strokeWidth={1.25} size={20} />
      </button>
      <div className="sidebar-content">
        <p className="content">Here we have to add content</p>
      </div>
    </div>
  );
};

export default Sidebar;
