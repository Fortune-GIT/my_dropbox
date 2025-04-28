import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";

export default function CreateFolderModal({ onClose }) {
  const [folderName, setFolderName] = useState("");
  const { currentFolderId } = useFolder();

  const handleCreate = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty!");
      return;
    }

    await addDoc(collection(db, "files"), {
      originalName: folderName,
      isFolder: true,
      createdAt: serverTimestamp(),
      parentFolder: currentFolderId || null
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Folder</h2>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder Name"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="btn" onClick={handleCreate}>Create</button>
          <button className="btn" style={{ background: "#ccc" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
