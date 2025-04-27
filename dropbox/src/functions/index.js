// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

exports.onFileDelete = functions.firestore
  .document("files/{fileId}")
  .onDelete(async (snap, context) => {
    const deletedValue = snap.data();
    const filePath = `uploads/${deletedValue.versionedName}`;
    await storage.bucket().file(filePath).delete();
    console.log(`Deleted versioned file: ${filePath}`);
  });
