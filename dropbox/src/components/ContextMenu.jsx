// src/components/ContextMenu.jsx
import React from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";

export default function ContextMenu({ file, position }) {
  const { currentView } = useFolder(); // Get current view (home, deleted, etc.)

  const handleRename = async () => {
    const newLabel = prompt("Enter new name:", file.originalName || file.versionedName);
  
    if (newLabel) {
      const extMatch = file.versionedName.match(/\.\w+$/);
      const extension = extMatch ? extMatch[0] : "";
  
      const versionedNameParts = file.versionedName.split("-");
      const timestamp = versionedNameParts.length > 1 ? versionedNameParts.slice(1).join("-").replace(extension, "") : "";
  
      const newVersionedName = `${newLabel.replace(/\s+/g, "_")}-${timestamp}${extension}`;
  
      const fileRef = doc(db, "files", file.id);
  
      await updateDoc(fileRef, {
        originalName: newLabel,
        versionedName: newVersionedName,
      });
  
      alert("✅ File renamed successfully!");
      window.location.reload();
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this file?")) {
      await deleteDoc(doc(db, "files", file.id));
      window.location.reload();
    }
  };

  const handleMoveToTrash = async () => {
    await updateDoc(doc(db, "files", file.id), {
      deleted: true,
    });
    alert("🗑️ Moved to trash!");
    window.location.reload();
  };

  const handleRestoreFromTrash = async () => {
    await updateDoc(doc(db, "files", file.id), {
      deleted: false,
    });
    alert("♻️ File restored to previous location!");
    window.location.reload();
  };

  const handleMarkShared = async () => {
    await updateDoc(doc(db, "files", file.id), {
      shared: true,
    });
    alert("🔗 File marked as shared!");
  };

  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <button onClick={handleRename}>✏️ Rename</button>
      <button onClick={handleMarkShared}>🔗 Mark as Shared</button>

      {/* Special behavior: Restore if inside Deleted view */}
      {currentView === "deleted" ? (
        <button onClick={handleRestoreFromTrash}>♻️ Restore</button>
      ) : (
        <button onClick={handleMoveToTrash}>🗑️ Move to Trash</button>
      )}

      <button onClick={handleDelete} style={{ color: "red" }}>
        ❌ Permanently Delete
      </button>
    </div>
  );
}
