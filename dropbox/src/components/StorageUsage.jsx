// src/components/StorageUsage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function StorageUsage() {
  const [totalSize, setTotalSize] = useState(0);

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

  return (
    <div className="storage-usage">
      📦 Storage Used: {(totalSize / (1024 * 1024)).toFixed(2)} MB of 2 GB
    </div>
  );
}
