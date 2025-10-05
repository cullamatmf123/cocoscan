import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';

// Initialize Firestore
const db = getFirestore();

export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
  message?: string;
  isAdmin?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  isAdmin?: boolean;
}

export class AuthService {
  // Sign up with email and password (supports both admin and user)
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, fullName, isAdmin = false } = data;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (userCredential?.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });

        // Store user role and additional info in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          fullName: fullName,
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date(),
          isActive: true
        });
      }
      
      return {
        success: true,
        user: userCredential.user,
        isAdmin: isAdmin,
        message: `${isAdmin ? 'Admin' : 'User'} account created successfully`
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

  // Sign in with email and password (checks user role)
  static async signIn(email: string, password: string, requireAdmin: boolean = false): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // If user document doesn't exist, create one with default user role
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          fullName: userCredential.user.displayName || 'User',
          role: 'user',
          createdAt: new Date(),
          isActive: true
        });
        
        if (requireAdmin) {
          await firebaseSignOut(auth);
          return {
            success: false,
            error: 'Access denied. Admin privileges required.'
          };
        }
        
        return {
          success: true,
          user: userCredential.user,
          isAdmin: false
        };
      }
      
      const userData = userDoc.data();
      const isAdmin = userData.role === 'admin';
      
      // Check if admin access is required
      if (requireAdmin && !isAdmin) {
        await firebaseSignOut(auth);
        return {
          success: false,
          error: 'Access denied. Admin privileges required.'
        };
      }
      
      // Check if user access is required (for regular user login)
      if (!requireAdmin && isAdmin) {
        await firebaseSignOut(auth);
        return {
          success: false,
          error: 'Please use the admin login portal.'
        };
      }
      
      return {
        success: true,
        user: userCredential.user,
        isAdmin: isAdmin,
        message: `Welcome ${isAdmin ? 'Admin' : 'User'}!`
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

  // Check if current user is admin
  static async isCurrentUserAdmin(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role === 'admin';
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get current authenticated user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  // Get user role
  static async getUserRole(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user';
      }
      return 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  // Sign out
  static async signOut(): Promise<AuthResult> {
    try {
      await firebaseSignOut(auth);
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign out failed'
      };
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = error.message || 'Failed to send password reset email.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}