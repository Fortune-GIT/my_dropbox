import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import ContextMenu from "./ContextMenu";
import PreviewModal from "./PreviewModal";

export default function FileTable() {
  const { currentFolderId, openFolder } = useFolder();
  const [files, setFiles] = useState([]);
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, folder) => {
    const fileId = e.dataTransfer.getData("text/plain");
    if (fileId) {
      const fileRef = doc(db, "files", fileId);
      await updateDoc(fileRef, {
        parentFolder: folder.id
      });
    }
  };

  const folders = files.filter(file => file.isFolder);
  const regularFiles = files.filter(file => !file.isFolder);

  const handleFileClick = (file) => {
    if (file.versionedName?.endsWith(".pdf") || file.versionedName?.endsWith(".png") || file.versionedName?.endsWith(".jpg")) {
      setPreviewFile(file.url);
    }
  };

  return (
    <div className="file-table" onClick={() => setShowContext(false)}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploaded At</th>
            <th>Size (MB)</th>
          </tr>
        </thead>
        <tbody>
          {folders.map(folder => (
            <tr key={folder.id} 
              onClick={() => handleOpenFolder(folder)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, folder)}
              style={{ cursor: "pointer", backgroundColor: "#f8f8f8" }}>
              <td>📁 {folder.originalName}</td>
              <td>{folder.createdAt?.toDate().toLocaleString()}</td>
              <td>—</td>
            </tr>
          ))}
          {regularFiles.map(file => (
            <tr
              key={file.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", file.id)}
              onContextMenu={(e) => handleRightClick(e, file)}
              onClick={() => handleFileClick(file)}
            >
              <td><a href={file.url} target="_blank" rel="noreferrer">{file.versionedName}</a></td>
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
