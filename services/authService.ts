// services/authService.ts
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    sendPasswordResetEmail as firebaseSendPasswordReset,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    Unsubscribe,
    User,
    UserCredential
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserData {
  name: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed.';
    case 'auth/weak-password':
      return 'The password is too weak (minimum 6 characters).';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your connection.';
    default:
      return 'An unknown error occurred. Please try again.';
  }
};

// Sign up a new user
export const signUp = async (email: string, password: string, name: string): Promise<UserCredential> => {
  try {
    if (!auth) throw new Error('Firebase Auth not initialized');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (db) {
      const userData: UserData = {
        name: name.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code) || 'Failed to create account');
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    if (!auth) throw new Error('Firebase Auth not initialized');
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code) || 'Failed to sign in');
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    if (!auth) throw new Error('Firebase Auth not initialized');
    await firebaseSendPasswordReset(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(getAuthErrorMessage(error.code) || 'Failed to send password reset email');
  }
};

// Get the current user
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null;
};

// Listen for auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void): Unsubscribe => {
  if (!auth) {
    console.error('Firebase Auth not initialized');
    return () => {};
  }
  return firebaseOnAuthStateChanged(auth, callback);
};