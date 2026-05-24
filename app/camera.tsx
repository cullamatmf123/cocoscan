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
  | 'infested by CRB'
  | 'other damage or abnormalities'
  | 'not infested';

interface HealthPrediction {
  prediction: CocoClass;
  confidence: number; // 0–100
  analysis?: {
    details: string;
    recommendations: string;
  };
}

// ✅ Updated to new Gradio space
const SPACE_ROOT = 'https://cullamatmf123-cocoscaniey.hf.space';
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

  if (!c) return 'not infested';

  if (c === 'not infested' || c === 'healthy') return 'not infested';
  if (
    c === 'infestation from other pest' ||
    c === 'unhealthy' ||
    c === 'other damage or abnormalities' ||
    c === 'other pest damage'
  )
    return 'other damage or abnormalities';
  if (c === 'infested by crb' || c === 'crb infestation')
    return 'infested by CRB';

  return 'not infested';
};

interface DistanceGuideEntry {
  label: string;
  distance: string;
  icon: string;
}

const DISTANCE_GUIDE: DistanceGuideEntry[] = [
  { label: 'Not infested (healthy palm)', distance: '5-6 meters', icon: '🟢' },
  { label: 'CRB infested (boreholes / near V-cut)', distance: '2-3 meters', icon: '🔴' },
  { label: 'CRB infested (far away V-cut)', distance: '7-10+ meters', icon: '🔴' },
  { label: 'Other damage / abnormalities', distance: 'Any distance', icon: '🔵' },
];

const getRecommendedDistance = (prediction: CocoClass): string => {
  switch (prediction) {
    case 'not infested':
      return '5-6 meters';
    case 'infested by CRB':
      return '2-3 m (near boreholes/V-cut) or 7-10+ m (far V-cut)';
    case 'other damage or abnormalities':
      return 'Any distance';
    default:
      return 'N/A';
  }
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
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
    prediction: 'not infested',
    confidence: 0,
    analysis: {
      details: 'Analysis failed. Could not reach the server.',
      recommendations: 'Check your connection and try again with a clearer photo.',
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
      prediction === 'not infested'
        ? 'No action needed. The coconut appears healthy.'
        : 'Please consult an agricultural expert for further assessment.';

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
  const [showGuide, setShowGuide] = useState(false);

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

    setAiLoading(true);
    try {
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

    setAiLoading(true);
    try {
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
                    if (p === 'not infested') return '#4CAF50';
                    if (p === 'infested by CRB') return '#F44336';
                    if (p === 'other damage or abnormalities') return '#3498DB';
                    return '#4CAF50';
                  })(),
                },
              ]}
            >
              {(() => {
                const p: CocoClass = capturedPhoto.healthResult.prediction;
                if (p === 'not infested') return '✅ Not infested';
                if (p === 'infested by CRB') return '❌ Infested by CRB';
                if (p === 'other damage or abnormalities')
                  return '⚠️ Other damage or abnormalities';
                return '✅ Not infested';
              })()}
            </Text>

            {capturedPhoto.healthResult.prediction !== 'not infested' && (
              <Text style={styles.healthConfidence}>
                {capturedPhoto.healthResult.confidence}% confidence
              </Text>
            )}

            {capturedPhoto.healthResult.prediction !== 'not infested' &&
              capturedPhoto.healthResult.analysis && (
                <Text style={styles.healthDetails}>
                  {capturedPhoto.healthResult.analysis.details}
                </Text>
              )}

            <Text style={styles.distanceRecommend}>
              📏 Recommended capture distance:{'\n'}
              {getRecommendedDistance(capturedPhoto.healthResult.prediction)}
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
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />

      {/* Distance Guide toggle button */}
      <TouchableOpacity
        style={styles.guideToggle}
        onPress={() => setShowGuide((v) => !v)}
        accessibilityLabel="Toggle distance guide"
      >
        <Text style={styles.guideToggleText}>📏</Text>
      </TouchableOpacity>

      {/* Distance Guide panel */}
      {showGuide && (
        <View style={styles.guidePanel}>
          <View style={styles.guideHeader}>
            <Text style={styles.guideTitle}>Recommended Capture Distance</Text>
            <TouchableOpacity onPress={() => setShowGuide(false)}>
              <Text style={styles.guideClose}>✕</Text>
            </TouchableOpacity>
          </View>
          {DISTANCE_GUIDE.map((entry, i) => (
            <View key={i} style={styles.guideRow}>
              <Text style={styles.guideIcon}>{entry.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.guideLabel}>{entry.label}</Text>
                <Text style={styles.guideValue}>{entry.distance}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

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

  /* Distance Guide */
  guideToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  guideToggleText: {
    fontSize: 22,
  },
  guidePanel: {
    position: 'absolute',
    top: 110,
    right: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 16,
    padding: 16,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  guideClose: {
    color: '#ccc',
    fontSize: 18,
    paddingHorizontal: 4,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  guideLabel: {
    color: '#ddd',
    fontSize: 13,
    fontWeight: '600',
  },
  guideValue: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 1,
  },

  /* Distance recommendation on preview */
  distanceRecommend: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
});