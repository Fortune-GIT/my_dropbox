// src/components/Topbar.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import CreateFolderModal from "./CreateFolderModal";
import { AiOutlineUpload, AiFillFolderAdd, AiOutlineLogout, AiOutlineArrowLeft } from "react-icons/ai";
import { getAuth, signOut } from "firebase/auth";

export default function Topbar() {
  const [files, setFiles] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingText, setUploadingText] = useState("");
  const { currentFolderId, currentView, openParentFolder } = useFolder();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleUpload = async () => {
    if (!files.length) return alert("Please choose a file!");

    let totalBytes = files.reduce((acc, file) => acc + file.size, 0);
    let uploadedBytes = 0;

    for (const file of files) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
      const [name, ext] = file.name.split(/\.(?=[^\.]+$)/);
      const versionedName = `${name}-${timestamp}.${ext}`;
      const storageRef = ref(storage, `uploads/${versionedName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const currentBytes = snapshot.bytesTransferred;
            uploadedBytes += currentBytes;
            const progress = Math.min(100, (uploadedBytes / totalBytes) * 100);

            setUploadProgress(progress.toFixed(1));
            setUploadingText(
              `Uploaded ${(uploadedBytes / (1024 * 1024)).toFixed(2)} MB / ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
            );
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, "files"), {
              originalName: file.name,
              versionedName,
              url: downloadURL,
              size: file.size,
              createdAt: serverTimestamp(),
              parentFolder: currentFolderId || null,
              fileType: ext.toLowerCase(),
              deleted: false,
              userId: user.uid, 
            });
            resolve();
          }
        );
      });
    }

    alert("Upload complete!");
    setFiles([]);
    setUploadProgress(0);
    setUploadingText("");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Signed out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Something went wrong while signing out.");
    }
  };

  return (
    <div className="topbar" style={{ display: "flex", flexDirection: "column", padding: "1rem", backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
      
      {/* Top Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
        
        {/* Back Button */}
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

        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />

        {/* Sign Out Button */}
        <button onClick={handleSignOut} className="btn red" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AiOutlineLogout size={18} />
          Sign Out
        </button>

      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
          📤 {uploadingText} ({uploadProgress}%)
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && <CreateFolderModal onClose={() => setShowCreateFolder(false)} />}
    </div>
  );
}
