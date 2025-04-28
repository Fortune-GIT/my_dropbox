// src/components/FileUploader.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFolder } from "../contexts/FolderContext";

export default function FileUploader() {
  const [files, setFiles] = useState([]);
  const { currentFolderId } = useFolder();

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please choose at least one file!");
      return;
    }

    for (const file of files) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
      const [name, ext] = file.name.split(/\.(?=[^\.]+$)/);
      const versionedName = `${name}-${timestamp}.${ext}`;
      const storageRef = ref(storage, `uploads/${versionedName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "files"), {
        originalName: file.name,
        versionedName,
        url: downloadURL,
        size: file.size,
        createdAt: serverTimestamp(),
        parentFolder: currentFolderId || null,
        deleted: false,            // ✅ Important for queries
        shared: false,             // ✅ For Shared Files feature
        fileType: ext.toLowerCase() // ✅ For Pictures filtering (jpg, png, etc.)
      });
    }

    alert("✅ Files uploaded successfully!");
    setFiles([]);
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={(e) => setFiles([...e.target.files])}
        multiple
      />
      <button onClick={handleUpload} className="btn">⬆️ Upload</button>
    </div>
  );
}
