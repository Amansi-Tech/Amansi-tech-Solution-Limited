// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkSGqjWWojfLZD1A5Cl5ABlvhb6ZZTCCk",
  authDomain: "amansi-tech.firebaseapp.com", // ✅ Replace with actual
  projectId: "project-39eda",
  storageBucket: "amansi-tech.appspot.com",
  messagingSenderId: "322454462858",
  appId: "1:322454462858:web:e480b551893f142d456873",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


export { db, app, auth };

