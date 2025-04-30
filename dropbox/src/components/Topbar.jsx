import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";
import CreateFolderModal from "./CreateFolderModal";
import { getAuth } from "firebase/auth";
import { AiOutlineUpload, AiFillFolderAdd, AiOutlineLogout, AiOutlineArrowLeft } from "react-icons/ai";

export default function Topbar() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingText, setUploadingText] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { currentFolderId, currentView, openParentFolder } = useFolder();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleUpload = async () => {
    if (!files.length || !user) {
      alert("Please choose a file or re-login!");
      return;
    }

    const userFiles = await getDocs(query(collection(db, "files"), where("userId", "==", user.uid)));
    const totalBytesUsed = userFiles.docs.reduce((acc, doc) => acc + (doc.data().size || 0), 0);

    const totalNewFilesSize = files.reduce((acc, file) => acc + file.size, 0);
    const total = totalBytesUsed + totalNewFilesSize;

    if (total > 2 * 1024 * 1024 * 1024) { // 2GB
      alert("❌ Storage limit exceeded! Each user has only 2GB.");
      return;
    }

    for (const file of files) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
      const [name, ext] = file.name.split(/\.(?=[^\.]+$)/);
      const versionedName = `${name}-${timestamp}.${ext}`;
      const storageRef = ref(storage, `uploads/${user.uid}/${versionedName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadingText(`Uploading ${(snapshot.bytesTransferred / (1024 * 1024)).toFixed(2)} MB`);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, "files"), {
              originalName: file.name,
              versionedName,
              url: downloadURL,
              size: file.size,
              createdAt: serverTimestamp(),
              parentFolder: currentFolderId || null,
              fileType: ext.toLowerCase(),
              deleted: false,
              userId: user.uid, // ✅ Attach userId
            });
            resolve();
          }
        );
      });
    }

    alert("✅ Upload complete!");
    setFiles([]);
    setUploadingText("");
    setUploadProgress(0);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="topbar">
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "10px" }}>
        {currentView === "folder" && currentFolderId && (
          <button className="btn" onClick={openParentFolder}>
            <AiOutlineArrowLeft /> Back
          </button>
        )}
        <label className="file-upload-button">
          📁 Choose Files
          <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} style={{ display: "none" }} />
        </label>
        <button className="btn blue" onClick={handleUpload}>
          <AiOutlineUpload /> Upload
        </button>
        <button className="btn blue" onClick={() => setShowCreateFolder(true)}>
          <AiFillFolderAdd /> Create Folder
        </button>
        <div style={{ flexGrow: 1 }} />
        <button className="btn red" onClick={handleSignOut}>
          <AiOutlineLogout /> Sign Out
        </button>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <div style={{ marginTop: "8px", fontSize: "14px" }}>
          📤 {uploadingText} ({uploadProgress.toFixed(1)}%)
        </div>
      )}

      {showCreateFolder && <CreateFolderModal onClose={() => setShowCreateFolder(false)} />}
    </div>
  );
}
