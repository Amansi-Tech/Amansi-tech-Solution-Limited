// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkSGqjWWojfLZD1A5Cl5ABlvhb6ZZTCCk",
  authDomain: "project-39eda.firebaseapp.com",
  projectId: "project-39eda",
  storageBucket: "project-39eda.firebasestorage.app",
  messagingSenderId: "322454462858",
  appId: "1:322454462858:web:e480b551893f142d456873",
  measurementId: "G-JVF8RL9TZJ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };


