import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBu-bdbhTlvBNtrDJ80VJlS8Q0-qzgg9Dk",
  authDomain: "airiska-1c12a.firebaseapp.com",
  projectId: "airiska-1c12a",
  storageBucket: "airiska-1c12a.firebasestorage.app",
  messagingSenderId: "693504482456",
  appId: "1:693504482456:web:64fef87fb2353cf2cd04ed",
  measurementId: "G-5K884HQ2KH"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics is only supported in browser environment
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { app, db };

