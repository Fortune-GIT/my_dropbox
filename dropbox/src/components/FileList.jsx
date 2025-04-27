import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function FileList() {
  const [groupedFiles, setGroupedFiles] = useState({});

  useEffect(() => {
    const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const files = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        };
      });

      const grouped = {};
      files.forEach(file => {
        const key = file.originalName;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(file);
      });
      setGroupedFiles(grouped);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "files", id));
  };

  const formatDate = (date) => {
    return date?.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="file-list">
      <h3>Your Files (Grouped by Original Name)</h3>
      {Object.keys(groupedFiles).map((name) => (
        <div key={name}>
          <h4>{name}</h4>
          <ul>
            {groupedFiles[name].map(file => (
              <li key={file.id}>
                <a href={file.url} target="_blank" rel="noreferrer">
                  {file.versionedName}
                </a>{" "}
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  (Uploaded: {formatDate(file.createdAt)})
                </span>
                <button onClick={() => handleDelete(file.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
