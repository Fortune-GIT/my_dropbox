// src/components/Sidebar.jsx
import React from "react";
import { useFolder } from "../contexts/FolderContext";

export default function Sidebar() {
  const { path, goHome, openFolder } = useFolder();

  return (
    <div className="sidebar">
      <h2 onClick={goHome} style={{ cursor: "pointer" }}>📁 MyDropbox</h2>

      {/* Directory Path (Breadcrumbs) */}
      <div style={{ marginTop: "1rem", fontSize: "14px" }}>
        {path.map((folder, index) => (
          <div key={folder.id || "home"} style={{ paddingLeft: `${index * 10}px`, cursor: "pointer" }}>
            {index !== 0 && "↳ "}
            <span onClick={() => {
              if (index === 0) {
                goHome();
              } else {
                openFolder(folder.id, folder.name);
              }
            }}>
              {folder.name}
            </span>
          </div>
        ))}
      </div>

      <ul style={{ marginTop: "2rem" }}>
        <li>🏠 Home</li>
        <li>🖼️ Photos</li>
        <li>👥 Shared</li>
        <li>🗑️ Deleted Files</li>
      </ul>
    </div>
  );
}
