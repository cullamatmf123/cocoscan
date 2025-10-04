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
  const results = [
    { prediction: 'Healthy', confidence: 92 },
    { prediction: 'Diseased', confidence: 87 },
    { prediction: 'Pest Detected', confidence: 94 }
  ];
  const randomResult = results[Math.floor(Math.random() * results.length)];
  return {
    ...randomResult,
    analysis: {
      details: `Mock analysis shows ${randomResult.prediction.toLowerCase()} condition`,
      recommendations: randomResult.prediction === 'Healthy' ? 'Continue current care' : 'Consider treatment'
    }
  };
};

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
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
              {capturedPhoto.healthResult.prediction}
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
        facing={facing}
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
          style={styles.flipButton}
          onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
          disabled={aiLoading}
        >
          <Text style={styles.flipText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickImage}
          disabled={aiLoading}
        >
          <Text style={styles.galleryText}>📁</Text>
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
  flipButton: {
    position: 'absolute',
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  flipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryButton: {
    position: 'absolute',
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  galleryText: {
    fontSize: 24,
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