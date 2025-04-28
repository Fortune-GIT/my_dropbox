// src/components/StorageUsage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function StorageUsage() {
  const [totalSize, setTotalSize] = useState(0);
  const maxSize = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), snapshot => {
      let sizeSum = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        sizeSum += data.size || 0;
      });
      setTotalSize(sizeSum);
    });

    return () => unsubscribe();
  }, []);

  const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
  const percentage = ((totalSize / maxSize) * 100).toFixed(2);

  return (
    <div className="storage-usage">
      <p>📦 Storage Used: {usedMB} MB of 2 GB ({percentage}%)</p>
      <div className="storage-bar">
        <div className="storage-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
