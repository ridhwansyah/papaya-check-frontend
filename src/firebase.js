// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBULnaWFmmyaZ5sk1V-E85qIlUbLDWugxg",
  authDomain: "papaya-check.firebaseapp.com",
  projectId: "papaya-check",
  storageBucket: "papaya-check.firebasestorage.app",
  messagingSenderId: "13096493733",
  appId: "1:13096493733:web:42ecb9ee3fa233e20e234c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;