import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type CocoClass =
  | 'unspecified'
  | 'crb infestation'
  | 'unhealthy'
  | 'oryctes rhinoceros'
  | 'healthy';

interface HealthPrediction {
  prediction: CocoClass;
  confidence: number; // 0–100
  analysis?: {
    details: string;
    recommendations: string;
  };
}

const SPACE_ROOT = 'https://cullamatmf123-capstone-cocoscan.hf.space';
const GRADIO_API_PREFIX = '/gradio_api';
const GRADIO_FN = 'predict_on_image';

const getMimeTypeFromUri = (uri: string): string => {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'image/jpeg';
};

const normalizePrediction = (
  className: string,
): HealthPrediction['prediction'] => {
  const c = String(className || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!c) return 'unspecified';

  if (c.includes('oryctes') || c.includes('rhinoceros'))
    return 'oryctes rhinoceros';

  // Rename "other pest damage" to "unhealthy" in the app
  if (c.includes('other') && c.includes('pest')) return 'unhealthy';

  // Keep: Rename "unhealthy" from HF to "crb infestation" in the app
  if (c.includes('unhealthy')) return 'crb infestation';

  if (c.includes('healthy')) return 'healthy';

  if (c === 'unspecified' || c === 'unknown') return 'unspecified';

  return 'unspecified';
};

const safeJson = async (res: Response): Promise<any | null> => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const safeText = async (res: Response): Promise<string> => {
  try {
    return await res.text();
  } catch {
    return '';
  }
};

const parseGradioHtmlToPrediction = (
  html: string,
): { className: string; confidence01: number } => {
  const safe = String(html || '');

  const classMatch =
    safe.match(/Predicted Class\s*:\s*([A-Z _-]+)/i) ||
    safe.match(/PREDICTED CLASS\s*:\s*([A-Z _-]+)/i);

  const confMatch =
    safe.match(/Confidence\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*%/i) ||
    safe.match(/CONFIDENCE\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*%/i);

  const clsRaw = classMatch?.[1] ? classMatch[1].trim() : 'unspecified';
  const confPct = confMatch?.[1] ? Number(confMatch[1]) : 0;

  const className = clsRaw.toLowerCase().replace(/\s+/g, ' ').trim();
  const confidence01 = isFinite(confPct)
    ? Math.max(0, Math.min(1, confPct / 100))
    : 0;

  return { className, confidence01 };
};

const uploadToGradio = async (imageUri: string): Promise<string | null> => {
  const url = `${SPACE_ROOT}${GRADIO_API_PREFIX}/upload`;

  const formData = new FormData();
  formData.append('files', {
    uri: imageUri,
    name: 'coconut.jpg',
    type: getMimeTypeFromUri(imageUri),
  } as any);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const data: any = await safeJson(res);

  const path =
    (Array.isArray(data) && data[0]) ||
    data?.[0] ||
    data?.files?.[0] ||
    data?.paths?.[0] ||
    null;

  if (!path || typeof path !== 'string') return null;
  return path;
};

const callGradio = async (uploadedPath: string): Promise<string | null> => {
  const url = `${SPACE_ROOT}${GRADIO_API_PREFIX}/call/${GRADIO_FN}`;

  const payload = {
    data: [
      {
        path: uploadedPath,
        meta: { _type: 'gradio.FileData' },
      },
    ],
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const data: any = await safeJson(res);

  const eventId =
    data?.event_id ||
    data?.eventId ||
    data?.id ||
    (typeof data === 'string' ? data : null);

  if (!eventId || typeof eventId !== 'string') return null;
  return eventId;
};

const getGradioResultHtml = async (eventId: string): Promise<string | null> => {
  const url = `${SPACE_ROOT}${GRADIO_API_PREFIX}/call/${GRADIO_FN}/${eventId}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const sse = await safeText(res);
  if (!sse) return null;

  const lines = sse
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const dataLines = lines.filter((l) => l.startsWith('data:'));
  if (dataLines.length === 0) return null;

  const last = dataLines[dataLines.length - 1].replace(/^data:\s*/, '');

  let parsed: any = null;
  try {
    parsed = JSON.parse(last);
  } catch {
    parsed = null;
  }

  const out = parsed?.[0]?.data ?? parsed?.data ?? parsed;
  const html = Array.isArray(out) ? out?.[1] : null;

  if (typeof html !== 'string') return null;
  return html;
};

const classifyHealth = async (imageUri: string): Promise<HealthPrediction> => {
  const fallback: HealthPrediction = {
    prediction: 'unspecified',
    confidence: 0,
    analysis: {
      details: 'No prediction available.',
      recommendations: 'Try again with a clearer photo and good lighting.',
    },
  };

  try {
    const uploadedPath = await uploadToGradio(imageUri);
    if (!uploadedPath) return fallback;

    const eventId = await callGradio(uploadedPath);
    if (!eventId) return fallback;

    const html = await getGradioResultHtml(eventId);
    if (!html) return fallback;

    const { className, confidence01 } = parseGradioHtmlToPrediction(html);
    const prediction = normalizePrediction(className);
    const confidence = Math.max(
      0,
      Math.min(100, Math.round(confidence01 * 100)),
    );

    const details = `Detected: ${prediction}`;
    const recommendations =
      prediction === 'healthy'
        ? 'No action needed.'
        : prediction === 'unspecified'
          ? 'Try retaking the photo (better lighting / closer image).'
          : 'Please consult an agricultural expert.';

    return {
      prediction,
      confidence,
      analysis: {
        details,
        recommendations,
      },
    };
  } catch {
    return fallback;
  }
};

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [aiLoading, setAiLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null);
  const [healthPrediction, setHealthPrediction] =
    useState<HealthPrediction | null>(null);

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
        quality: 0.8,
        base64: false,
        exif: false,
        skipProcessing: false,
      });

      if (!photo?.uri) return;

      const healthResult = await classifyHealth(photo.uri);

      setHealthPrediction(healthResult);
      setCapturedPhoto({
        ...photo,
        healthResult,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (aiLoading) return;

    try {
      setAiLoading(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const selectedImage = result.assets[0];
      const healthResult = await classifyHealth(selectedImage.uri);

      setHealthPrediction(healthResult);
      setCapturedPhoto({
        uri: selectedImage.uri,
        width: selectedImage.width,
        height: selectedImage.height,
        healthResult,
      });
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
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>
              Grant Camera Permission
            </Text>
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
                  color: (() => {
                    const p: CocoClass = capturedPhoto.healthResult.prediction;
                    if (p === 'healthy') return '#4CAF50';
                    if (p === 'crb infestation') return '#F44336';
                    if (p === 'oryctes rhinoceros') return '#8E44AD';
                    if (p === 'unhealthy') return '#3498DB';
                    return '#F39C12'; // unspecified
                  })(),
                },
              ]}
            >
              {(() => {
                const p: CocoClass = capturedPhoto.healthResult.prediction;
                if (p === 'healthy') return '✅ Healthy';
                if (p === 'crb infestation') return '❌ CRB infestation';
                if (p === 'oryctes rhinoceros') return '🪲 Oryctes Rhinoceros';
                if (p === 'unhealthy') return '⚠️ Unhealthy';
                return '⚠️ Unspecified';
              })()}
            </Text>

            {capturedPhoto.healthResult.prediction !== 'healthy' && (
              <Text style={styles.healthConfidence}>
                {capturedPhoto.healthResult.confidence}% confidence
              </Text>
            )}

            {capturedPhoto.healthResult.prediction !== 'healthy' &&
              capturedPhoto.healthResult.analysis && (
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