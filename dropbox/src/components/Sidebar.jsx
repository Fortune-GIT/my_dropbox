import React from "react";
import { useFolder } from "../contexts/FolderContext";
import { AiFillHome, AiFillPicture, AiOutlineShareAlt, AiFillDelete } from "react-icons/ai";

export default function Sidebar() {
  const { goHome, openPictures, openSharedFiles, openDeletedFiles } = useFolder();

  return (
    <div className="sidebar" style={{ padding: "1.5rem 1rem" }}>
      {/* Title */}
      <h2 onClick={goHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
       <span>MyDropbox</span>
      </h2>

      {/* Links */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li 
          onClick={goHome} 
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            marginBottom: "1.5rem", 
            fontSize: "16px" 
          }}
        >
          <AiFillHome size={20} /> Home
        </li>

        <li 
          onClick={openPictures} 
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            marginBottom: "1.5rem", 
            fontSize: "16px" 
          }}
        >
          <AiFillPicture size={20} /> Pictures
        </li>

        <li 
          onClick={openSharedFiles} 
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "5px", 
            marginBottom: "1.5rem", 
            fontSize: "16px" 
          }}
        >
          <AiOutlineShareAlt size={20} /> Shared Files
        </li>

        <li 
          onClick={openDeletedFiles} 
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "16px" 
          }}
        >
          <AiFillDelete size={20} /> Trash
        </li>
      </ul>
    </div>
  );
}
