import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function StorageUsage() {
  const [used, setUsed] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "files"),
      where("userId", "==", userId),
      where("deleted", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const totalBytes = snapshot.docs.reduce((acc, doc) => acc + (doc.data().size || 0), 0);
      setUsed(totalBytes);
    });

    return () => unsubscribe();
  }, [userId]);

  const usedGB = (used / (1024 * 1024 * 1024)).toFixed(2);
  const maxGB = 2;

  return (
    <div className="storage-usage">
      <p>Storage Usage: {usedGB} GB / {maxGB} GB</p>
      <progress value={used} max={2 * 1024 * 1024 * 1024} style={{ width: "100%" }} />
    </div>
  );
}
