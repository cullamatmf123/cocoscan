import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  Timestamp, 
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export type HistoryItem = {
  id?: string;
  userId: string;
  timestamp: Date;
  imageUri?: string | null;
  photoBase64?: string | null;
  prediction?: string;
  confidence?: string;
  details?: string;
  recommendations?: string;
  weather?: string;
  soil?: string;
};

const historyCollection = 'scanHistory';

// Convert Firestore data to HistoryItem
const toHistoryItem = (doc: QueryDocumentSnapshot): HistoryItem => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId || '',
    timestamp: data.timestamp?.toDate() || new Date(),
    imageUri: data.imageUri || null,
    photoBase64: data.photoBase64 || null,
    prediction: data.prediction || 'Unknown',
    confidence: data.confidence || '0',
    details: data.details || '',
    recommendations: data.recommendations || '',
    weather: data.weather || '',
    soil: data.soil || '',
  };
};

export const getUserHistory = async (): Promise<HistoryItem[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user logged in, returning empty history');
      return [];
    }

    // Simple query without orderBy to avoid index requirements
    const q = query(
      collection(db, historyCollection),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    const historyItems = querySnapshot.docs.map(toHistoryItem);
    
    // Sort in JavaScript to avoid Firestore index requirements
    return historyItems.sort((a, b) => {
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
      return timeB - timeA; // Descending order (newest first)
    });
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const addHistoryItem = async (item: Omit<HistoryItem, 'id' | 'userId' | 'timestamp'>): Promise<HistoryItem> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newItem: Omit<HistoryItem, 'id'> = {
      ...item,
      userId: user.uid,
      timestamp: new Date(),
    };

    // Clean the data before saving to Firestore
    const firestoreData = {
      userId: newItem.userId,
      timestamp: Timestamp.fromDate(newItem.timestamp),
      imageUri: newItem.imageUri || null,
      photoBase64: newItem.photoBase64 || null,
      prediction: newItem.prediction || 'Unknown',
      confidence: newItem.confidence || '0',
      details: newItem.details || '',
      recommendations: newItem.recommendations || '',
      weather: newItem.weather || '',
      soil: newItem.soil || '',
    };

    const docRef = await addDoc(collection(db, historyCollection), firestoreData);

    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error('Error adding history item:', error);
    throw error;
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }
    await deleteDoc(doc(db, historyCollection, id));
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
};

export const deleteMultipleHistoryItems = async (ids: string[]): Promise<void> => {
  try {
    if (!ids || ids.length === 0) {
      return;
    }
    
    const deletePromises = ids.map(id => {
      if (id) {
        return deleteDoc(doc(db, historyCollection, id));
      }
      return Promise.resolve();
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple history items:', error);
    throw error;
  }
};