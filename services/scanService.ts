import { doc, setDoc, collection, getDocs, query, where, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export interface ScanData {
  id?: string;
  userId: string;
  imageUri: string;
  prediction: string;
  confidence: number;
  details: string;
  recommendations: string;
  conditions: {
    weather: string;
    soil: string;
    temperature: number;
    humidity: number;
    lightCondition: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ScanService {
  // Save a new scan with conditions to Firestore
  static async saveScan(scanData: Omit<ScanData, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const scanRef = doc(collection(db, 'scans'));
      const now = new Date();
      
      await setDoc(scanRef, {
        ...scanData,
        id: scanRef.id,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving scan:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save scan data' 
      };
    }
  }

  // Get all scans for the current user
  static async getUserScans(): Promise<{ data: ScanData[] | null; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const q = query(
        collection(db, 'scans'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const scans: ScanData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        scans.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as ScanData);
      });

      return { data: scans };
    } catch (error) {
      console.error('Error fetching user scans:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch scans' 
      };
    }
  }

  // Get a single scan by ID
  static async getScanById(scanId: string): Promise<{ data: ScanData | null; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const scanRef = doc(db, 'scans', scanId);
      const scanDoc = await getDoc(scanRef);

      if (!scanDoc.exists()) {
        return { data: null, error: 'Scan not found' };
      }

      const data = scanDoc.data();
      
      // Verify the scan belongs to the current user
      if (data.userId !== user.uid) {
        return { data: null, error: 'Unauthorized access to scan' };
      }

      return {
        data: {
          id: scanDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as ScanData
      };
    } catch (error) {
      console.error('Error fetching scan:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to fetch scan' 
      };
    }
  }
}

export default ScanService;
