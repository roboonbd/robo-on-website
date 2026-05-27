import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcfBwodM0KEnL5HLPegokqs2A5nhbhHlY",
  authDomain: "main-website-93895.firebaseapp.com",
  projectId: "main-website-93895",
  storageBucket: "main-website-93895.firebasestorage.app",
  messagingSenderId: "741591827381",
  appId: "1:741591827381:web:cef6988d5a6edc926c8ffc"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const PROJECT_ID = firebaseConfig.projectId;
export const ADMIN_EMAILS = ["admin@roboonbd.com", "roboonbd@gmail.com"];

export default app;
