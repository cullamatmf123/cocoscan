// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhUr94wnjPzgBq491eVHEsnelpq0ngblQ",
  authDomain: "cocoscan-app-web.firebaseapp.com",
  projectId: "cocoscan-app-web",
  storageBucket: "cocoscan-app-web.firebasestorage.app",
  messagingSenderId: "483349048929",
  appId: "1:483349048929:web:055da0171fccba26288420",
  measurementId: "G-MXS9LJKZXS"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
