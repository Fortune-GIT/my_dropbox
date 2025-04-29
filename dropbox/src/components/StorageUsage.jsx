// src/components/StorageUsage.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export default function StorageUsage() {
  const [used, setUsed] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "files"),
      where("userId", "==", user.uid),
      where("deleted", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const totalBytes = snapshot.docs.reduce((acc, doc) => acc + (doc.data().size || 0), 0);
      setUsed(totalBytes);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);
  const maxGB = 2;

  return (
    <div className="storage-usage">
      <p>Storage Usage: {usedGB} GB / {maxGB} GB</p>
      <progress value={used} max={2 * 1024 * 1024 * 1024} style={{ width: "100%" }} />
    </div>
  );
}
