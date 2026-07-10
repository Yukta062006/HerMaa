import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBXLeGO54oy9N6rPNPuwBFUW4EjWCjjoY",
  authDomain: "hermaa-d1fa0.firebaseapp.com",
  projectId: "hermaa-d1fa0",
  storageBucket: "hermaa-d1fa0.firebasestorage.app",
  messagingSenderId: "97986584547",
  appId: "1:97986584547:web:7f1c0fc16e2b731ad14ad6",
  measurementId: "G-E84MNVKLZ3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
