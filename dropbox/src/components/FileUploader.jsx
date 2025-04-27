// src/components/FileUploader.jsx
import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FileUploader() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

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
      createdAt: serverTimestamp()
    });

    alert("✅ File uploaded!");
    setFile(null);
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} className="btn">⬆️ Upload</button>
    </div>
  );
}
