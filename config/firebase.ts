// config/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { enableIndexedDbPersistence, Firestore, getFirestore } from 'firebase/firestore';

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
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  db = getFirestore(app);
  
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Offline persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
  });
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
