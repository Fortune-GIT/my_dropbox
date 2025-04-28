import React, { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc, getDocs, collection, where, query } from "firebase/firestore";

export default function ContextMenu({ file, position }) {
  const [newName, setNewName] = useState("");

  const handleDelete = async () => {
    if (file.isFolder) {
      // Delete all children
      const q = query(collection(db, "files"), where("parentFolder", "==", file.id));
      const querySnapshot = await getDocs(q);
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, "files", docSnap.id));
      }
    }
    await deleteDoc(doc(db, "files", file.id));
    window.location.reload();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(file.url);
    alert("🔗 Link copied to clipboard!");
  };

  const handleRename = async () => {
    const newLabel = prompt("Enter new name:", file.originalName || file.versionedName);
    if (newLabel) {
      await updateDoc(doc(db, "files", file.id), {
        originalName: newLabel,
      });
      window.location.reload();
    }
  };

  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <button onClick={handleShare}>🔗 Share</button>
      <button onClick={handleRename}>✏️ Rename</button>
      <button onClick={handleDelete} style={{ color: "red" }}>🗑️ Delete</button>
    </div>
  );
}
