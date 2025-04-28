// src/components/FileTable.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import ContextMenu from "./ContextMenu";
import PreviewModal from "./PreviewModal";

export default function FileTable() {
  const { currentFolderId, openFolder } = useFolder();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contextFile, setContextFile] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "files"),
      where("parentFolder", "==", currentFolderId || null),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentFolderId]);

  const handleRightClick = (e, file) => {
    e.preventDefault();
    setContextFile(file);
    setContextPosition({ x: e.pageX, y: e.pageY });
    setShowContext(true);
  };

  const handleOpenFolder = (folder) => {
    openFolder(folder.id, folder.originalName);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e, folder) => {
    e.preventDefault();
    const fileIds = JSON.parse(e.dataTransfer.getData("text/plain"));
    for (const fileId of fileIds) {
      const fileRef = doc(db, "files", fileId);
      await updateDoc(fileRef, { parentFolder: folder.id });
    }
  };

  const handleDragStart = (e, fileId) => {
    if (selectedFiles.length > 1) {
      e.dataTransfer.setData("text/plain", JSON.stringify(selectedFiles));
    } else {
      e.dataTransfer.setData("text/plain", JSON.stringify([fileId]));
    }
  };

  const toggleFileSelection = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      alert("Select at least one file/folder to delete!");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete selected items?");
    if (confirmDelete) {
      for (const fileId of selectedFiles) {
        await deleteDoc(doc(db, "files", fileId));
      }
      setSelectedFiles([]);
      alert("Selected files/folders deleted.");
    }
  };

  const handleFileClick = (file) => {
    if (file.versionedName?.endsWith(".pdf") || file.versionedName?.endsWith(".png") || file.versionedName?.endsWith(".jpg")) {
      setPreviewFile(file.url);
    }
  };

  const folders = files.filter(file => file.isFolder && file.originalName.toLowerCase().includes(searchTerm.toLowerCase()));
  const regularFiles = files.filter(file => !file.isFolder && file.versionedName?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="file-table" onClick={() => setShowContext(false)}>
      {/* SEARCH + BULK DELETE */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="🔎 Search files or folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", flexGrow: 1, borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button className="btn" onClick={handleBulkDelete} style={{ background: "red" }}>
          Delete
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Uploaded At</th>
            <th>Size (MB)</th>
          </tr>
        </thead>
        <tbody>
          {folders.map(folder => (
            <tr
              key={folder.id}
              onClick={() => handleOpenFolder(folder)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, folder)}
              style={{ cursor: "pointer", backgroundColor: "#f8f8f8" }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(folder.id)}
                  onChange={() => toggleFileSelection(folder.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td>📁 {folder.originalName}</td>
              <td>{folder.createdAt?.toDate().toLocaleString()}</td>
              <td>—</td>
            </tr>
          ))}

          {regularFiles.map(file => (
            <tr
              key={file.id}
              draggable
              onDragStart={(e) => handleDragStart(e, file.id)}
              onContextMenu={(e) => handleRightClick(e, file)}
              onClick={() => handleFileClick(file)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td>
                <a href={file.url} target="_blank" rel="noreferrer">
                  {file.versionedName}
                </a>
              </td>
              <td>{file.createdAt?.toDate().toLocaleString()}</td>
              <td>{(file.size / (1024 * 1024)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showContext && <ContextMenu file={contextFile} position={contextPosition} />}
      {previewFile && <PreviewModal url={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
}
