// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>📁 MyDropbox</h2>
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
