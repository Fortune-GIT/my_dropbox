// src/components/Sidebar.jsx
import React from "react";
import { useFolder } from "../contexts/FolderContext";

export default function Sidebar() {
  const { goHome } = useFolder();

  return (
    <div className="sidebar">
      <h2 onClick={goHome} style={{ cursor: "pointer" }}>📁 MyDropbox</h2>
      <ul>
        <li>🏠 Home</li>
        <li>🖼️ Photos</li>
        <li>👥 Shared</li>
        <li>📝 Signatures</li>
        <li>📥 File Requests</li>
        <li>🗑️ Deleted Files</li>
      </ul>
    </div>
  );
}
