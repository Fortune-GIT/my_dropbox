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

      <FileUploader />
      <button className="btn" onClick={() => setShowModal(true)}>
        ➕ Create Folder
      </button>
      <button className="btn">
        🔗 Share
      </button>

      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
