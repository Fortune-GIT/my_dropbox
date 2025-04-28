// src/components/Topbar.jsx
import React, { useState } from "react";
import { useFolder } from "../contexts/FolderContext";
import FileUploader from "./FileUploader";
import CreateFolderModal from "./CreateFolderModal";

export default function Topbar() {
  const [showModal, setShowModal] = useState(false);
  const { path, goBack } = useFolder();

  return (
    <div className="topbar">
      {/* BACK BUTTON */}
      {path.length > 1 && (
        <button className="btn" onClick={goBack}>
          ⬅️ Back
        </button>
      )}

      {/* Upload Files */}
      <FileUploader />

      {/* Create Folder */}
      <button className="btn" onClick={() => setShowModal(true)}>
        ➕ Create Folder
      </button>

      {/* The Share Button REMOVED from here */}
      
      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
