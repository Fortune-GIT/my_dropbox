// src/components/Topbar.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import CreateFolderModal from "./CreateFolderModal";
import { AiOutlineUpload, AiFillFolderAdd, AiOutlineLogout, AiOutlineArrowLeft } from "react-icons/ai"; // Added logout and back icons
import { getAuth, signOut } from "firebase/auth"; // Firebase auth

export default function Topbar() {
  const [files, setFiles] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { currentFolderId, currentView, openParentFolder } = useFolder();
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
    <div className="topbar" style={{ display: "flex", alignItems: "center", padding: "1rem", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
        
        {/* BACK Button */}
        {currentView === "folder" && currentFolderId && (
          <button onClick={openParentFolder} className="btn" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <AiOutlineArrowLeft size={18} />
            Back
          </button>
        )}

        {/* Choose Files */}
        <label className="file-upload-button" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", padding: "0.5rem 1rem", background: "#f0f0f0", borderRadius: "6px" }}>
          📁 Choose Files
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            style={{ display: "none" }}
          />
        </label>

        {/* Upload Button */}
        <button onClick={handleUpload} className="btn blue" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <AiOutlineUpload size={18} />
          Upload
        </button>

        {/* Create Folder */}
        <button onClick={() => setShowCreateFolder(true)} className="btn blue" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <AiFillFolderAdd size={18} />
          Create Folder
        </button>

      </div>

      {/* Sign Out Button */}
      <button onClick={handleSignOut} className="btn red" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <AiOutlineLogout size={18} />
        Sign Out
      </button>

      {/* Create Folder Modal */}
      {showCreateFolder && <CreateFolderModal onClose={() => setShowCreateFolder(false)} />}
    </div>
  );
}
