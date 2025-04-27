
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDofGwjq4mLnbHP7aXetrkXLyrLcccQrAU",
  authDomain: "dropbox-2be05.firebaseapp.com",
  projectId: "dropbox-2be05",
  storageBucket: "dropbox-2be05.firebasestorage.app",
  messagingSenderId: "841007218610",
  appId: "1:841007218610:web:d9782e583d6948d971aeab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);