import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import { getAuth } from "firebase/auth";
import ContextMenu from "./ContextMenu";
import PreviewModal from "./PreviewModal";
import {
  AiFillFolder,
  AiFillFile,
  AiOutlineLink,
  AiOutlineDownload,
  AiOutlineSearch
} from "react-icons/ai";

export default function FileTable() {
  const { currentFolderId, currentView, openFolder } = useFolder();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contextFile, setContextFile] = useState(null);
  const [showContext, setShowContext] = useState(false);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [previewFile, setPreviewFile] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // ✅ Important: only run if user exists

    let q;
    const baseConditions = [
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    ];

    switch (currentView) {
      case "pictures":
        q = query(
          collection(db, "files"),
          where("fileType", "in", ["jpg", "jpeg", "png"]),
          where("deleted", "==", false),
          ...baseConditions
        );
        break;
      case "shared":
        q = query(
          collection(db, "files"),
          where("shared", "==", true),
          where("deleted", "==", false),
          ...baseConditions
        );
        break;
      case "deleted":
        q = query(
          collection(db, "files"),
          where("deleted", "==", true),
          ...baseConditions
        );
        break;
      case "folder":
        q = query(
          collection(db, "files"),
          where("parentFolder", "==", currentFolderId || null),
          where("deleted", "==", false),
          ...baseConditions
        );
        break;
      default:
        q = query(
          collection(db, "files"),
          where("parentFolder", "==", null),
          where("deleted", "==", false),
          ...baseConditions
        );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentFolderId, currentView, user?.uid]); // ✅ Always fixed dependencies

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
    const payload = selectedFiles.length > 1 ? selectedFiles : [fileId];
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return alert("Select at least one item.");
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    for (const fileId of selectedFiles) {
      await deleteDoc(doc(db, "files", fileId));
    }
    setSelectedFiles([]);
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.setAttribute("download", file.originalName || "downloaded-file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const folders = files.filter(
    (f) => f.isFolder && f.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const regularFiles = files.filter(
    (f) => !f.isFolder && f.versionedName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="file-table" onClick={() => setShowContext(false)}>
      {/* Search + Bulk Delete */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "60px", alignItems: "center" }}>
        <div style={{ position: "relative", flexGrow: 1 }}>
          <AiOutlineSearch
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#888",
              fontSize: "20px"
            }}
          />
          <input
            type="text"
            placeholder="Search files or folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem 0.5rem 0.5rem 2.5rem",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button className="btn" onClick={handleBulkDelete} style={{ background: "red" }}>
          Delete
        </button>
      </div>

      {/* Table for Files & Folders */}
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
          {folders.map((folder) => (
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
              <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AiFillFolder style={{ color: "#f5a623" }} />
                {folder.originalName}
              </td>
              <td>{folder.createdAt?.toDate().toLocaleString()}</td>
              <td>—</td>
            </tr>
          ))}

          {regularFiles.map((file) => (
            <tr
              key={file.id}
              draggable
              onDragStart={(e) => handleDragStart(e, file.id)}
              onContextMenu={(e) => handleRightClick(e, file)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AiFillFile />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {file.versionedName}
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(file.url);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "8px" }}
                >
                  <AiOutlineLink />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "8px" }}
                >
                  <AiOutlineDownload />
                </button>
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
