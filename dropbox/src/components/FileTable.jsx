import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function FileTable() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const folders = files.filter(file => file.isFolder);
  const regularFiles = files.filter(file => !file.isFolder);

  return (
    <div className="file-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploaded At</th>
            <th>Size (MB)</th>
          </tr>
        </thead>
        <tbody>
          {/* Show Folders First */}
          {folders.map(folder => (
            <tr key={folder.id}>
              <td>📁 {folder.originalName}</td>
              <td>{folder.createdAt?.toDate().toLocaleString()}</td>
              <td>—</td>
            </tr>
          ))}

          {/* Then Files */}
          {regularFiles.map(file => (
            <tr key={file.id}>
              <td><a href={file.url} target="_blank" rel="noreferrer">{file.versionedName}</a></td>
              <td>{file.createdAt?.toDate().toLocaleString()}</td>
              <td>{(file.size / (1024 * 1024)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
