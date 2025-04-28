// src/components/Sidebar.jsx
import React from "react";
import { useFolder } from "../contexts/FolderContext";

export default function Sidebar() {
  const { goHome, openPictures, openSharedFiles, openDeletedFiles } = useFolder();

  return (
    <div className="sidebar">
      <h2 onClick={goHome} style={{ cursor: "pointer" }}>📁 MyDropbox</h2>

      <ul style={{ marginTop: "2rem" }}>
        <li style={{ cursor: "pointer" }} onClick={goHome}>🏠 Home</li>
        <li style={{ cursor: "pointer" }} onClick={openPictures}>🖼️ Pictures</li>
        <li style={{ cursor: "pointer" }} onClick={openSharedFiles}>👥 Shared Files</li>
        <li style={{ cursor: "pointer" }} onClick={openDeletedFiles}>🗑️ Deleted Files</li>
      </ul>
    </div>
  );
}
