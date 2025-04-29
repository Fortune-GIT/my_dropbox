import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import { getAuth } from "firebase/auth";

export default function CreateFolderModal({ onClose }) {
  const [folderName, setFolderName] = useState("");
  const { currentFolderId } = useFolder();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleCreate = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty!");
      return;
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    await addDoc(collection(db, "files"), {
      originalName: folderName,
      isFolder: true,
      parentFolder: currentFolderId || null,
      createdAt: serverTimestamp(),
      deleted: false,
      userId: user.uid, // ✅ Important: tag it to the logged-in user
    });

    alert("✅ Folder created successfully!");
    setFolderName("");
    onClose();
  };

  return (
    <div className="modal">
      <h2>Create New Folder</h2>
      <input
        type="text"
        placeholder="Folder Name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
        <button className="btn" onClick={handleCreate}>Create</button>
        <button className="btn" onClick={onClose} style={{ backgroundColor: "#ccc" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
