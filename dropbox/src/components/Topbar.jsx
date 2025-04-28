// src/components/Topbar.jsx
import React, { useState } from "react";
import FileUploader from "./FileUploader";
import CreateFolderModal from "./CreateFolderModal";

export default function Topbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="topbar">
      <FileUploader />
      <button className="btn" onClick={() => setShowModal(true)}>➕ Create Folder</button>
      <button className="btn">🔗 Share</button>

      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
