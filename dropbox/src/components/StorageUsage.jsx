import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function StorageUsage() {
  const [usedBytes, setUsedBytes] = useState(0);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "files"),
      where("userId", "==", user.uid),
      where("deleted", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().size || 0), 0);
      setUsedBytes(total);
    });

    return () => unsubscribe();
  }, [user]);

  const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
  const maxMB = 2048; 
  const usagePercent = ((usedBytes / (1024 * 1024 * 2048)) * 100).toFixed(2);

  return (
    <div className="storage-usage" style={{ padding: "1rem" }}>
      <p>
        <strong>Storage Usage:</strong> {usedMB} MB / 2048 MB ({usagePercent}%)
      </p>
      <progress value={usedBytes} max={2 * 1024 * 1024 * 1024} style={{ width: "100%" }} />
    </div>
  );
}
