import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatme-404.firebaseapp.com",
  projectId: "chatme-404",
  storageBucket: "chatme-404.firebasestorage.app",
  messagingSenderId: "1037451810779",
  appId: "1:1037451810779:web:a8d90236f1217e89b679fe",
  measurementId: "G-GT0KVYZVK7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
