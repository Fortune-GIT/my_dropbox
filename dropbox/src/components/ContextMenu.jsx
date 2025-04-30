import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ContextMenu({ file, position }) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  if (!file || !user) return null;

  const fileRef = doc(db, "files", file.id);

  const handleRename = async () => {
    if (!newName.trim()) {
      alert("New name cannot be empty!");
      return;
    }

    try {
      if (file.isFolder) {
        await updateDoc(fileRef, { originalName: newName });
      } else {
        const ext = file.versionedName.split(".").pop();
        const updatedVersionedName = `${newName}-${Date.now()}.${ext}`;
        await updateDoc(fileRef, {
          originalName: newName,
          versionedName: updatedVersionedName,
        });
      }

      alert("✅ Renamed successfully!");
      setRenaming(false);
    } catch (error) {
      console.error("Rename error:", error);
      alert("❌ Failed to rename.");
    }
  };

  const handleToggleShared = async () => {
    try {
      await updateDoc(fileRef, {
        shared: !file.shared,
      });
      alert(file.shared ? "🔒 Unshared" : "✅ Marked as shared!");
    } catch (error) {
      console.error("Toggle share error:", error);
      alert("❌ Failed to toggle shared status.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to move to trash?")) return;

    try {
      await updateDoc(fileRef, { deleted: true });
      alert("🗑️ Moved to trash!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete.");
    }
  };

  const handleRecover = async () => {
    try {
      await updateDoc(fileRef, { deleted: false });
      alert("✅ Restored from trash!");
    } catch (error) {
      console.error("Recover error:", error);
      alert("❌ Failed to restore.");
    }
  };

  const handlePermanentDelete = async () => {
    if (!window.confirm("⚠️ Permanently delete this item? This cannot be undone.")) return;

    try {
      await deleteDoc(fileRef);
      alert("🗑️ File permanently deleted!");
    } catch (error) {
      console.error("Permanent delete error:", error);
      alert("❌ Failed to permanently delete.");
    }
  };

  return (
    <div
      className="context-menu"
      style={{
        top: position.y,
        left: position.x,
        position: "absolute",
        backgroundColor: "white",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        padding: "10px",
        borderRadius: "6px",
        zIndex: 9999,
      }}
    >
      {!renaming ? (
        <>
          <button className="btn" onClick={() => setRenaming(true)}>✏️ Rename</button>

          {!file.deleted && !file.isFolder && (
            <button className="btn" onClick={handleToggleShared}>
              {file.shared ? "🔒 Unshare" : "🤝 Mark as Shared"}
            </button>
          )}

          {file.deleted ? (
            <>
              <button className="btn" onClick={handleRecover}>♻️ Recover</button>
              <button className="btn" onClick={handlePermanentDelete}>❌ Permanently Delete</button>
            </>
          ) : (
            <button className="btn" onClick={handleDelete}>🗑️ Move to Trash</button>
          )}
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New Name"
          />
          <button className="btn" onClick={handleRename}>Save</button>
          <button className="btn" onClick={() => setRenaming(false)} style={{ backgroundColor: "#ccc" }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
