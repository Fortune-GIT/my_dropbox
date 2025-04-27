// src/components/CreateFolderModal.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateFolderModal({ onClose }) {
  const [folderName, setFolderName] = useState("");

  const handleCreate = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty!");
      return;
    }

    await addDoc(collection(db, "files"), {
      originalName: folderName,
      isFolder: true,
      createdAt: serverTimestamp()
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Folder</h2>
        <input
          type="text"
          value={folderName}
          onChange={e => setFolderName(e.target.value)}
          placeholder="Folder Name"
        />
        <button onClick={handleCreate} className="btn">Create</button>
        <button onClick={onClose} className="btn" style={{ background: "#ccc" }}>Cancel</button>
      </div>
    </div>
  );
}
