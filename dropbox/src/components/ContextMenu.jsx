// src/components/ContextMenu.jsx
import React from "react";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function ContextMenu({ file, position }) {
  const handleDelete = async () => {
    await deleteDoc(doc(db, "files", file.id));
    window.location.reload();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(file.url);
    alert("🔗 Link copied to clipboard!");
  };

  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <button onClick={handleShare}>🔗 Share</button>
      <button onClick={handleDelete} style={{ color: "red" }}>🗑️ Delete</button>
    </div>
  );
}
