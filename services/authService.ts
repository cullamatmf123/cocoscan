import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (userCredential?.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      }
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      let errorMessage = 'Sign up failed';
      
      // Handle common Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign up.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      let errorMessage = 'Sign in failed';
      
      // Handle common Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign in.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Sign out the current user
  static async signOut(): Promise<AuthResult> {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign out'
      };
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send password reset email'
      };
    }
  }

  // Get the current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen for auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}