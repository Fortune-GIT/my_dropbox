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
import ContextMenu from "./ContextMenu";
import PreviewModal from "./PreviewModal";
import {
  AiFillFolder,
  AiFillFile,
  AiOutlineLink,
  AiOutlineDownload,
  AiOutlineSearch
} from "react-icons/ai";
import { getAuth } from "firebase/auth";

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
    if (!user) return;

    let q;

    if (currentView === "pictures") {
      q = query(
        collection(db, "files"),
        where("userId", "==", user.uid),
        where("fileType", "in", ["jpg", "jpeg", "png"]),
        where("deleted", "==", false),
        orderBy("createdAt", "desc")
      );
    } else if (currentView === "shared") {
      q = query(
        collection(db, "files"),
        where("userId", "==", user.uid),
        where("shared", "==", true),
        where("deleted", "==", false),
        orderBy("createdAt", "desc")
      );
    } else if (currentView === "deleted") {
      q = query(
        collection(db, "files"),
        where("userId", "==", user.uid),
        where("deleted", "==", true),
        orderBy("createdAt", "desc")
      );
    } else if (currentView === "folder") {
      q = query(
        collection(db, "files"),
        where("userId", "==", user.uid),
        where("parentFolder", "==", currentFolderId || null),
        where("deleted", "==", false),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "files"),
        where("userId", "==", user.uid),
        where("parentFolder", "==", null),
        where("deleted", "==", false),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, snapshot => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentFolderId, currentView, user]);

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
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedFiles.length) return alert("Select at least one file/folder to delete!");

    if (window.confirm("Move selected items to trash?")) {
      for (const fileId of selectedFiles) {
        await updateDoc(doc(db, "files", fileId), { deleted: true });
      }
      setSelectedFiles([]);
      alert("🗑️ Moved to trash.");
    }
  };

  const handleFileClick = (file) => {
    if ([".pdf", ".png", ".jpg"].some(ext => file.versionedName?.endsWith(ext))) {
      setPreviewFile(file.url);
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.setAttribute("download", file.originalName || "downloaded-file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const folders = files.filter(f => f.isFolder && f.originalName.toLowerCase().includes(searchTerm.toLowerCase()));
  const regularFiles = files.filter(f => !f.isFolder && f.versionedName?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="file-table" onClick={() => setShowContext(false)}>
      {/* SEARCH & DELETE */}
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

      {/* FILE DISPLAY */}
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
              <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AiFillFolder style={{ color: "#f5a623" }} />
                {folder.originalName}
              </td>
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
              <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <AiFillFile style={{ color: "#7d7d7d" }} />
                <a href={file.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                  {file.versionedName}
                </a>

                {/* LINK */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!file.url) return alert("❌ No URL available.");
                    navigator.clipboard.writeText(file.url)
                      .then(() => alert("🔗 Link copied!"))
                      .catch(() => alert("❌ Failed to copy link."));
                  }}
                  title="Copy Link"
                  style={{
                    marginLeft: "8px", background: "none", border: "none",
                    cursor: "pointer", fontSize: "18px", color: "#555"
                  }}
                >
                  <AiOutlineLink />
                </button>

                {/* DOWNLOAD */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                  title="Download"
                  style={{
                    marginLeft: "8px", background: "none", border: "none",
                    cursor: "pointer", fontSize: "18px", color: "#555"
                  }}
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
