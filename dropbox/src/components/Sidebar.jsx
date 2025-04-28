// src/components/Sidebar.jsx
import React from "react";
import { useFolder } from "../contexts/FolderContext";

export default function Sidebar() {
  const { path, goHome } = useFolder();
  const currentFolder = path[path.length - 1];

  return (
    <div className="sidebar">
      <h2 onClick={goHome} style={{ cursor: "pointer" }}>📁 MyDropbox</h2>

      {/* Display the current folder cleanly */}
      <div style={{ marginTop: "1rem", fontSize: "14px" }}>
        <div
          key={`${currentFolder.name}-${path.length - 1}`} // use name + index
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          {currentFolder?.name || "Home"}
        </div>
      </div>

      {/* Static Links */}
      <ul style={{ marginTop: "2rem" }}>
        <li>🏠 Home</li>
        <li>🖼️ Photos</li>
        <li>👥 Shared</li>
        <li>🗑️ Deleted Files</li>
      </ul>
    </div>
  );
}
