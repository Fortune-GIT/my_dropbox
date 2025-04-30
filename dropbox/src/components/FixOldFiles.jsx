import { useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function FixOldFiles() {
  useEffect(() => {
    const fixFiles = async () => {
      const snapshot = await getDocs(collection(db, "files"));
      
      const fixes = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        let updates = {};

        // If fileType is missing or wrong
        if (!data.fileType && data.originalName) {
          const parts = data.originalName.split(".");
          const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
          if (ext) {
            updates.fileType = ext;
          }
        }

        // If deleted is missing
        if (typeof data.deleted === "undefined") {
          updates.deleted = false;
        }

        // If we have any updates, apply them
        if (Object.keys(updates).length > 0) {
          const fileRef = doc(db, "files", docSnap.id);
          await updateDoc(fileRef, updates);
          console.log(`✅ Fixed ${docSnap.id}`);
        }
      });

      await Promise.all(fixes);
      alert("✅ Old files updated successfully!");
    };

    fixFiles();
  }, []);

  return null; // This component renders nothing
}
