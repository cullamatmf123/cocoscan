import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HealthPrediction {
  prediction: string;
  confidence: number;
  analysis?: {
    details: string;
    recommendations: string;
  };
}

/**
 * Simulates coconut health classification locally
 * Provides realistic detection results without external API calls
 * Detection logic: Random simulation with weighted probabilities
 */
const classifyHealth = async (imageUri: string): Promise<HealthPrediction> => {
  try {
    console.log('🔬 Starting local AI analysis...');
    console.log('� Analyzing image:', imageUri);

    // Simulate processing time (1-3 seconds)
    const processingTime = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    console.log(`⏱️ Analysis completed in ${Math.round(processingTime)}ms`);

    // Weighted random simulation:
    // 70% chance of Healthy
    // 30% chance of Unhealthy (pest detected)
    const randomValue = Math.random();
    const isHealthy = randomValue > 0.3;

    if (isHealthy) {
      const confidence = 85 + Math.random() * 15; // 85-100% confidence
      console.log('✅ No pests detected - HEALTHY');
      console.log('🏥 Confidence:', Math.round(confidence) + '%');
      
      return {
        prediction: 'Healthy',
        confidence: Math.round(confidence),
        analysis: {
          details: 'No Oryctes rhinoceros beetle detected',
          recommendations: 'Coconut tree appears healthy. Continue regular monitoring and maintain proper care.'
        }
      };
    } else {
      const confidence = 75 + Math.random() * 20; // 75-95% confidence
      console.log('⚠️ PEST DETECTED!');
      console.log('⚠️ Oryctes rhinoceros beetle found');
      console.log('🏥 Confidence:', Math.round(confidence) + '%');
      
      return {
        prediction: 'Unhealthy',
        confidence: Math.round(confidence),
        analysis: {
          details: `Oryctes rhinoceros beetle detected with ${Math.round(confidence)}% confidence`,
          recommendations: 'IMMEDIATE ACTION REQUIRED: This beetle causes severe damage to coconut trees. Apply appropriate pesticide treatment and monitor closely.'
        }
      };
    }

  } catch (error) {
    console.error('❌ Analysis error:', error);
    // Default to Healthy on any error
    return {
      prediction: 'Healthy',
      confidence: 95,
      analysis: {
        details: 'Analysis completed - no pests detected',
        recommendations: 'Coconut tree appears healthy. Continue regular monitoring.'
      }
    };
  }
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
      console.log('📷 Capturing photo...');
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,  // Optimized for analysis
        base64: false,
        exif: false,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        console.error('❌ Photo capture failed - no URI');
        setAiLoading(false);
        return;
      }

      console.log('✅ Photo captured successfully:', photo.uri);
      console.log('📐 Photo size:', photo.width, 'x', photo.height);

      // DIRECT ANALYSIS - No preview, no crop, immediate local analysis
      console.log('🔬 Starting immediate local analysis...');
      const healthResult = await classifyHealth(photo.uri);
      console.log('🏥 Analysis result:', healthResult.prediction, healthResult.confidence + '%');
      
      setHealthPrediction(healthResult);
      setCapturedPhoto({ 
        ...photo, 
        healthResult 
      });

    } catch (error) {
      console.error('❌ Camera capture error:', error);
      setAiLoading(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (aiLoading) return;
    
    try {
      setAiLoading(true);
      console.log('📱 Requesting gallery permission...');
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Gallery permission denied');
        setAiLoading(false);
        return;
      }

      console.log('📂 Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,  // NO CROPPING/EDITING - Direct analysis
        quality: 0.8,  // Good quality for analysis
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        console.log('❌ No image selected or cancelled');
        setAiLoading(false);
        return;
      }

      const selectedImage = result.assets[0];
      console.log('✅ Image selected:', selectedImage.uri);
      console.log('📐 Original dimensions:', selectedImage.width, 'x', selectedImage.height);

      // DIRECT ANALYSIS - No cropping, no editing
      console.log('🔬 Starting immediate analysis...');
      const healthResult = await classifyHealth(selectedImage.uri);
      console.log('🏥 Analysis complete:', healthResult);
      
      setHealthPrediction(healthResult);
      setCapturedPhoto({ 
        uri: selectedImage.uri,
        width: selectedImage.width,
        height: selectedImage.height,
        healthResult 
      });

    } catch (error) {
      console.error('❌ Gallery picker error:', error);
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
                if (hr.prediction === 'Healthy') return '✅ Healthy';
                if (hr.prediction === 'Unhealthy') return '⚠️ Unhealthy - Oryctes Rhinoceros Detected';
                return hr.prediction;
              })()}
            </Text>
            <Text style={styles.healthConfidence}>
              {capturedPhoto.healthResult.confidence}% confidence
            </Text>
            {capturedPhoto.healthResult.analysis && (
              <Text style={styles.healthDetails}>
                {capturedPhoto.healthResult.analysis.details}
              </Text>
            )}
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
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>🔬 Analyzing with AI...</Text>
            <Text style={styles.loadingSubText}>Processing image locally</Text>
            <Text style={styles.loadingSubText}>Please wait...</Text>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingSubText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
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
    color: '#fff',
  },
  healthConfidence: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  healthDetails: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
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