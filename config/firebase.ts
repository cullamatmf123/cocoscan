// config/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhUr94wnjPzgBq491eVHEsnelpq0ngblQ",
  authDomain: "cocoscan-app-web.firebaseapp.com",
  projectId: "cocoscan-app-web",
  storageBucket: "cocoscan-app-web.firebasestorage.app",
  messagingSenderId: "483349048929",
  appId: "1:483349048929:web:055da0171fccba26288420"
};

// Initialize Firebase
let app;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // For React Native, we'll use standard auth initialization
  // AsyncStorage persistence is handled automatically in React Native
  auth = initializeAuth(app);
  
  db = getFirestore(app);
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

