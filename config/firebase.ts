// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);

  // Optional: Enable offline persistence
  // import { enableIndexedDbPersistence } from 'firebase/firestore';
  // enableIndexedDbPersistence(db).catch((err) => {
  //   if (err.code === 'failed-precondition') {
  //     console.warn('Offline persistence can only be enabled in one tab at a time.');
  //   } else if (err.code === 'unimplemented') {
  //     console.warn('The current browser does not support offline persistence.');
  //   }
  // });

} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error; // Re-throw to prevent the app from starting with broken Firebase
}

export { auth, db, app as default };