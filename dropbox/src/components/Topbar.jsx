// src/components/Topbar.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import CreateFolderModal from "./CreateFolderModal";
import { AiOutlineUpload, AiFillFolderAdd, AiOutlineArrowLeft } from "react-icons/ai"; // Added icons

export default function Topbar() {
  const [files, setFiles] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { currentFolderId, currentView, goHome } = useFolder();

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please choose at least one file!");
      return;
    }

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

    alert("✅ Files uploaded successfully!");
    setFiles([]);
  };

  const handleBack = () => {
    goHome();
  };

  return (
    <div className="topbar">
      {/* BACK BUTTON */}
      {currentView === "folder" && currentFolderId && (
        <button onClick={handleBack} className="btn" style={{ marginRight: "10px" }}>
          <AiOutlineArrowLeft size={18} style={{ marginRight: 6 }} />
          Back
        </button>
      )}

      {/* CUSTOM FILE UPLOAD */}
      <div className="custom-file-upload">
        <label htmlFor="fileInput" className="btn" style={{ marginRight: "10px" }}>
          📂 Choose Files
        </label>
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setFiles([...e.target.files])}
          multiple
        />
      </div>

      {/* UPLOAD BUTTON */}
      <button onClick={handleUpload} className="btn">
        <AiOutlineUpload size={18} style={{ marginRight: 6 }} />
        Upload
      </button>

      {/* CREATE FOLDER */}
      <button onClick={() => setShowCreateFolder(true)} className="btn">
        <AiFillFolderAdd size={18} style={{ marginRight: 6 }} />
        Create Folder
      </button>

      {showCreateFolder && <CreateFolderModal onClose={() => setShowCreateFolder(false)} />}
    </div>
  );
}
