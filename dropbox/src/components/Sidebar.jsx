// src/components/Sidebar.jsx
import React from "react";
import { useFolder } from "../contexts/FolderContext";
import { AiFillHome, AiFillPicture, AiOutlineShareAlt, AiFillDelete } from "react-icons/ai";

export default function Sidebar() {
  const { goHome, openPictures, openSharedFiles, openDeletedFiles } = useFolder();

  return (
    <div className="sidebar">
      <h2 onClick={goHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
        📁 MyDropbox
      </h2>

      <ul style={{ marginTop: "2rem", listStyle: "none", padding: 0 }}>
        <li style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }} onClick={goHome}>
          <AiFillHome size={20} /> Home
        </li>
        <li style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }} onClick={openPictures}>
          <AiFillPicture size={20} /> Pictures
        </li>
        <li style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }} onClick={openSharedFiles}>
          <AiOutlineShareAlt size={20} /> Shared Files
        </li>
        <li style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }} onClick={openDeletedFiles}>
          <AiFillDelete size={20} /> Deleted Files
        </li>
      </ul>
    </div>
  );
}
