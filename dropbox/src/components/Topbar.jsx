// src/components/Topbar.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import CreateFolderModal from "./CreateFolderModal";
import { AiOutlineUpload, AiFillFolderAdd, AiOutlineLogout } from "react-icons/ai"; // Added logout icon
import { getAuth, signOut } from "firebase/auth"; // Firebase auth

export default function Topbar() {
  const [files, setFiles] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { currentFolderId, currentView, goHome, openParentFolder } = useFolder();
  const auth = getAuth();

  const handleUpload = async () => {
    if (!files.length) return alert("Please choose a file!");
    for (const file of files) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
      const [name, ext] = file.name.split(/\.(?=[^\.]+$)/);
      const versionedName = `${name}-${timestamp}.${ext}`;
      const storageRef = ref(storage, `uploads/${versionedName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await addDoc(collection(db, "files"), {
        originalName: file.name,
        versionedName,
        url: downloadURL,
        size: file.size,
        createdAt: serverTimestamp(),
        parentFolder: currentFolderId || null,
        fileType: ext.toLowerCase(),
        deleted: false,
      });
    }
    alert("✅ Upload successful!");
    setFiles([]);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("👋 Signed out successfully!");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Something went wrong while signing out.");
    }
  };

  return (
    <div className="topbar">
      <div className="toolbar">
        {/* Upload buttons */}
        <label className="file-upload-button">
          📁 Choose Files
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            style={{ display: "none" }}
          />
        </label>

        <button onClick={handleUpload} className="btn blue">
          <AiOutlineUpload /> Upload
        </button>

        <button onClick={() => setShowCreateFolder(true)} className="btn blue">
          <AiFillFolderAdd /> Create Folder
        </button>

        {/* Sign Out button */}
        <button onClick={handleSignOut} className="btn red" style={{ marginLeft: "auto" }}>
          <AiOutlineLogout /> Sign Out
        </button>
      </div>

      {showCreateFolder && <CreateFolderModal onClose={() => setShowCreateFolder(false)} />}
    </div>
  );
}
