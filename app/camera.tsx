import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HealthPrediction {
  prediction: string;
  confidence: number;
  analysis?: {
    details: string;
    recommendations: string;
  };
}

const mockClassifyHealth = async (): Promise<HealthPrediction> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Choose between Healthy, Unhealthy with presence, Unhealthy with signs
  const roll = Math.random();
  if (roll < 0.34) {
    return {
      prediction: 'Healthy',
      confidence: Math.floor(90 + Math.random() * 10),
      analysis: {
        details: 'No signs of pest detected',
        recommendations: 'Continue current care',
      },
    };
  }
  const isPresence = roll < 0.67; // middle bucket -> presence, upper bucket -> signs
  const confidence = Math.floor(80 + Math.random() * 20);
  return {
    // Keep as 'Pest Detected' so routing logic elsewhere (includes("healthy")) is unaffected
    prediction: 'Pest Detected',
    confidence,
    analysis: {
      // Presence variant contains presence-related keywords
      // Signs variant contains signs/symptoms keywords
      details: isPresence
        ? 'Presence of adult beetle detected near the crown; live Oryctes Rhinoceros presence observed'
        : 'V-shaped cuts and triangular notches on fronds; bore hole signs consistent with Oryctes Rhinoceros',
      recommendations: 'Consider treatment and monitoring',
    },
  };
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [aiLoading, setAiLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null);
  const [healthPrediction, setHealthPrediction] = useState<HealthPrediction | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const handleTakePhoto = async () => {
    if (aiLoading || !cameraRef.current) return;
    
    try {
      setAiLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      const healthResult = await mockClassifyHealth();
      setHealthPrediction(healthResult);
      setCapturedPhoto({ 
        ...photo, 
        healthResult 
      });

    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (aiLoading) return;
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permissions are needed to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      setAiLoading(true);
      const healthResult = await mockClassifyHealth();
      setHealthPrediction(healthResult);
      setCapturedPhoto({ 
        uri: result.assets[0].uri, 
        healthResult 
      });

    } catch (error) {
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'Failed to load image from gallery.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDone = () => {
    if (capturedPhoto && capturedPhoto.healthResult) {
      router.push({
        pathname: '/conditions',
        params: {
          imageUri: capturedPhoto.uri,
          prediction: capturedPhoto.healthResult.prediction,
          confidence: capturedPhoto.healthResult.confidence.toString(),
          details: capturedPhoto.healthResult.analysis?.details || '',
          recommendations: capturedPhoto.healthResult.analysis?.recommendations || ''
        }
      });
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setHealthPrediction(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>⏳</Text>
          <Text style={styles.messageText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.iconText}>📷</Text>
          <Text style={styles.messageText}>Camera permission is required</Text>
          <Text style={styles.subText}>to scan coconuts for pests</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: capturedPhoto.uri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        
        {capturedPhoto.healthResult && (
          <View style={styles.healthOverlay}>
            <Text style={[
              styles.healthStatus,
              { 
                color: capturedPhoto.healthResult.prediction === 'Healthy' 
                  ? '#4CAF50' 
                  : '#F44336' 
              }
            ]}>
              {(() => {
                const hr: HealthPrediction = capturedPhoto.healthResult;
                if (hr.prediction === 'Healthy') return 'Healthy';
                const d = (hr.analysis?.details || '').toLowerCase();
                const presence = ['presence', 'beetle', 'adult', 'larva', 'grub', 'found', 'seen', 'captured', 'detected'].some(k => d.includes(k));
                const sign = ['sign', 'symptom', 'v-shaped', 'triangular', 'notch', 'bore hole', 'cuts', 'fronds', 'leaf'].some(k => d.includes(k));
                if (sign) return 'Unhealthy, Oryctes Rhinoceros Sign';
                if (presence) return 'Unhealthy: Oryctes Rhinoceros Detected';
                return 'Unhealthy';
              })()}
            </Text>
            <Text style={styles.healthConfidence}>
              {capturedPhoto.healthResult.confidence}% confidence
            </Text>
          </View>
        )}
        
        <View style={styles.previewButtonsContainer}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.doneButton} 
            onPress={handleDone}
            disabled={aiLoading}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef}
      />
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.captureButton, styles.captureCenter]}
          onPress={handleTakePhoto}
          disabled={aiLoading}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickImage}
          disabled={aiLoading}
        >
          <View style={styles.galleryIconContainer}>
            <View style={styles.galleryIconRow}>
              <View style={[styles.galleryIconSquare, styles.galleryIconSquareTopLeft]} />
              <View style={[styles.galleryIconSquare, styles.galleryIconSquareTopRight]} />
            </View>
            <View style={styles.galleryIconRow}>
              <View style={[styles.galleryIconSquare, styles.galleryIconSquareBottomLeft]} />
              <View style={[styles.galleryIconSquare, styles.galleryIconSquareBottomRight]} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {aiLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>🔍 Analyzing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconText: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  messageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureCenter: {
    marginHorizontal: 40,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  galleryButton: {
    position: 'absolute',
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIconContainer: {
    width: 30,
    height: 30,
  },
  galleryIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  galleryIconSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  galleryIconSquareTopLeft: {
    borderTopLeftRadius: 4,
  },
  galleryIconSquareTopRight: {
    borderTopRightRadius: 4,
  },
  galleryIconSquareBottomLeft: {
    borderBottomLeftRadius: 4,
  },
  galleryIconSquareBottomRight: {
    borderBottomRightRadius: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
  },
  healthOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 12,
  },
  healthStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthConfidence: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  previewButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  retakeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  retakeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});