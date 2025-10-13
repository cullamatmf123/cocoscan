import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  deleteDoc, 
  doc, 
  Timestamp, 
  QueryDocumentSnapshot,
  DocumentData
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
  temperature?: number;
  humidity?: number;
  lightCondition?: string;
};

const historyCollection = 'scanHistory'; // or 'scanHistory' based on your Firestore

// Convert Firestore document to HistoryItem
const toHistoryItem = (doc: QueryDocumentSnapshot<DocumentData>): HistoryItem => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId || '',
    timestamp: data.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
    imageUri: data.imageUri || null,
    photoBase64: data.photoBase64 || null,
    prediction: data.prediction || 'Unknown',
    confidence: data.confidence?.toString() || '0',
    details: data.details || '',
    recommendations: data.recommendations || '',
    weather: data.weather || data.conditions?.weather || '',
    soil: data.soil || data.conditions?.soil || '',
    temperature: data.temperature || data.conditions?.temperature,
    humidity: data.humidity || data.conditions?.humidity,
    lightCondition: data.lightCondition || data.conditions?.lightCondition || ''
  };
};

export const getUserHistory = async (): Promise<HistoryItem[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user logged in');
      return [];
    }

    const q = query(
      collection(db, historyCollection),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    const historyItems = querySnapshot.docs.map(toHistoryItem);
    
    // Sort by timestamp in descending order (newest first)
    return historyItems.sort((a, b) => 
      (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
    );
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const addHistoryItem = async (
  item: Omit<HistoryItem, 'id' | 'userId' | 'timestamp'>
): Promise<HistoryItem> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Structure the data to match the security rules
    const firestoreData = {
      userId: user.uid,
      timestamp: Timestamp.now(),
      imageUri: item.imageUri || null,
      photoBase64: item.photoBase64 || null,
      prediction: item.prediction || 'Unknown',
      confidence: item.confidence || '0',
      details: item.details || '',
      recommendations: item.recommendations || '',
      conditions: {
        weather: item.weather || 'Not specified',
        soil: item.soil || 'Not specified',
        temperature: typeof item.temperature === 'number' ? item.temperature : 0,
        humidity: typeof item.humidity === 'number' ? item.humidity : 0,
        lightCondition: item.lightCondition || 'Not specified'
      }
    };

    const docRef = await addDoc(collection(db, historyCollection), firestoreData);

    // Return the saved item with the generated ID
    return {
      id: docRef.id,
      userId: user.uid,
      timestamp: firestoreData.timestamp.toDate(),
      ...item
    };
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

export const getHistoryItem = async (id: string): Promise<HistoryItem | null> => {
  try {
    if (!id) {
      throw new Error('Document ID is required');
    }

    const docRef = doc(db, historyCollection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return toHistoryItem(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('Error getting history item:', error);
    throw error;
  }
};