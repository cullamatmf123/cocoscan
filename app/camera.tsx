import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HealthPrediction {
  // Three main classes from your backend + fallback string
  prediction: 'Healthy' | 'Unhealthy' | 'Oryctes Rhinoceros' | string;
  confidence: number; // 0–100
  analysis?: {
    details: string;
    recommendations: string;
  };
}

const HF_API_URL =
  'https://cullamatmf123-oryctes-rhinoceros-detector.hf.space/analyze-image';

const getMimeTypeFromUri = (uri: string): string => {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'image/jpeg';
};

/**
 * Calls the Hugging Face backend API to classify coconut health.
 * Backend returns JSON like:
 *
 * Beetle detected:
 * {
 *   "prediction": "Unhealthy (Beetle Detected)",
 *   "health_status": "unhealthy",
 *   "beetle_detected": true,
 *   "damage_detected": true,
 *   "confidence": 97,
 *   "analysis": { ... },
 *   ...
 * }
 *
 * Damage only:
 * {
 *   "prediction": "Unhealthy (Damage Detected)",
 *   "health_status": "unhealthy",
 *   "beetle_detected": false,
 *   "damage_detected": true,
 *   "confidence": 88,
 *   "analysis": { ... },
 *   ...
 * }
 *
 * Healthy:
 * {
 *   "prediction": "Healthy",
 *   "health_status": "healthy",
 *   "beetle_detected": false,
 *   "damage_detected": false,
 *   "confidence": 95,
 *   "analysis": { ... },
 *   ...
 * }
 */
const classifyHealth = async (imageUri: string): Promise<HealthPrediction> => {
  console.log('🌐 Sending image to Hugging Face API...');
  console.log('🖼️ Image URI:', imageUri);

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'coconut.jpg',
    type: getMimeTypeFromUri(imageUri),
  } as any);

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        // Do NOT set Content-Type manually; RN sets the proper multipart boundary
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();
    console.log('✅ HF API response:', data);

    const healthStatus = (data.health_status ?? '').toString().toLowerCase();
    const beetleDetected: boolean = !!data.beetle_detected;
    const damageDetected: boolean = !!data.damage_detected;
    const rawPrediction: string = (data.prediction ?? '').toString();

    // Normalize to the 3 classes for the app
    let prediction: HealthPrediction['prediction'];

    if (beetleDetected) {
      // Oryctes rhinoceros beetle box detected
      prediction = 'Oryctes Rhinoceros';
    } else if (damageDetected || healthStatus === 'unhealthy') {
      // Unhealthy / damage boxes but no beetle
      prediction = 'Unhealthy';
    } else {
      // No unhealthy / beetle detections
      prediction = 'Healthy';
    }

    // Confidence: backend already returns 0–100 integer, but keep fallback
    let confidence = 95;
    if (typeof data.confidence === 'number') {
      confidence = data.confidence;
    }

    const analysis =
      data.analysis ??
      {
        details:
          prediction === 'Healthy'
            ? 'No Oryctes rhinoceros beetle or unhealthy regions detected above the configured confidence threshold.'
            : prediction === 'Unhealthy'
            ? 'The model detected unhealthy regions on the coconut palm consistent with stress, disease, or damage.'
            : 'Oryctes rhinoceros beetle detected on the coconut palm.',
        recommendations:
          prediction === 'Healthy'
            ? 'Tree appears healthy. Continue regular monitoring.'
            : prediction === 'Unhealthy'
            ? 'Inspect the affected area for pests, disease, or nutrient deficiency and apply appropriate treatment.'
            : 'IMMEDIATE ACTION RECOMMENDED: Inspect affected fronds and apply beetle-specific pest management (traps, biological control, or approved insecticides) according to local guidelines.',
      };

    return {
      prediction,
      confidence,
      analysis,
    };
  } catch (error) {
    console.error('❌ API analysis failed:', error);
    // Safe fallback if API or network fails
    return {
      prediction: 'Healthy',
      confidence: 95,
      analysis: {
        details: 'AI analysis failed (network or server error).',
        recommendations: 'Please check your internet connection and try again.',
      },
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
        quality: 0.8, // Optimized for analysis
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

      console.log('🔬 Sending to Hugging Face for analysis...');
      const healthResult = await classifyHealth(photo.uri);
      console.log(
        '🏥 Analysis result:',
        healthResult.prediction,
        healthResult.confidence + '%',
      );

      setHealthPrediction(healthResult);
      setCapturedPhoto({
        ...photo,
        healthResult,
      });
    } catch (error) {
      console.error('❌ Camera capture error:', error);
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
        allowsEditing: false, // Direct analysis, no cropping
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        console.log('❌ No image selected or cancelled');
        setAiLoading(false);
        return;
      }

      const selectedImage = result.assets[0];
      console.log('✅ Image selected:', selectedImage.uri);
      console.log(
        '📐 Original dimensions:',
        selectedImage.width,
        'x',
        selectedImage.height,
      );

      console.log('🔬 Sending to Hugging Face for analysis...');
      const healthResult = await classifyHealth(selectedImage.uri);
      console.log('🏥 Analysis complete:', healthResult);

      setHealthPrediction(healthResult);
      setCapturedPhoto({
        uri: selectedImage.uri,
        width: selectedImage.width,
        height: selectedImage.height,
        healthResult,
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
          recommendations:
            capturedPhoto.healthResult.analysis?.recommendations || '',
        },
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
            <Text
              style={[
                styles.healthStatus,
                {
                  color:
                    capturedPhoto.healthResult.prediction === 'Healthy'
                      ? '#4CAF50'
                      : '#F44336',
                },
              ]}
            >
              {(() => {
                const hr: HealthPrediction = capturedPhoto.healthResult;
                if (hr.prediction === 'Healthy') return '✅ Healthy';
                if (hr.prediction === 'Unhealthy')
                  return '⚠️ Unhealthy – Damage detected';
                if (hr.prediction === 'Oryctes Rhinoceros')
                  return '🪲 Oryctes Rhinoceros detected';
                return hr.prediction;
              })()}
            </Text>
            {capturedPhoto.healthResult.prediction !== 'Healthy' && (
              <Text style={styles.healthConfidence}>
                {capturedPhoto.healthResult.confidence}% confidence
              </Text>
            )}
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
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />

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
              <View
                style={[
                  styles.galleryIconSquare,
                  styles.galleryIconSquareTopLeft,
                ]}
              />
              <View
                style={[
                  styles.galleryIconSquare,
                  styles.galleryIconSquareTopRight,
                ]}
              />
            </View>
            <View style={styles.galleryIconRow}>
              <View
                style={[
                  styles.galleryIconSquare,
                  styles.galleryIconSquareBottomLeft,
                ]}
              />
              <View
                style={[
                  styles.galleryIconSquare,
                  styles.galleryIconSquareBottomRight,
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {aiLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>Analyzing...</Text>
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