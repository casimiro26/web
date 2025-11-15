import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Camera as CameraIcon, RotateCcw, Sparkles } from 'lucide-react-native';
import { simulateEmotionDetection, simulateGenderDetection, simulateAgeDetection } from '@/utils/mockDetection';
import { generateRecommendations } from '@/utils/skinRecommendations';
import { saveAnalysis } from '@/services/storageService';
import { AnalysisResult } from '@/types/analysis';

const emotionEmojis = {
  feliz: '😊',
  triste: '😢',
  enojado: '😠',
  sorprendido: '😲',
  neutral: '😐',
  miedo: '😨',
  disgusto: '🤢',
};

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const emojiScale = useRef(new Animated.Value(0)).current;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <CameraIcon size={64} color="#9ca3af" />
        <Text style={styles.permissionTitle}>Acceso a la cámara</Text>
        <Text style={styles.permissionMessage}>
          Necesitamos tu permiso para usar la cámara y analizar tu rostro
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const showEmotionEmoji = (emotion: string) => {
    setDetectedEmotion(emotion);
    setShowEmoji(true);

    Animated.sequence([
      Animated.spring(emojiScale, {
        toValue: 1.2,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(emojiScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      hideEmotionEmoji();
    }, 5000);
  };

  const hideEmotionEmoji = () => {
    Animated.timing(emojiScale, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowEmoji(false);
      setDetectedEmotion(null);
    });
  };

  async function captureImage(): Promise<string | null> {
    try {
      if (!cameraRef.current) return null;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      console.log('[v0] Imagen capturada:', photo.uri);
      return photo.uri;
    } catch (error) {
      console.error('[v0] Error al capturar imagen:', error);
      return null;
    }
  }

  async function analyzeImage() {
    setAnalyzing(true);

    setTimeout(async () => {
      try {
        const imageUri = await captureImage();
        console.log('[v0] URI de imagen:', imageUri);

        const emotion = simulateEmotionDetection();
        const gender = simulateGenderDetection();
        const age = simulateAgeDetection();
        const recommendations = generateRecommendations(emotion, gender, age);

        const analysis: AnalysisResult = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          emotion,
          gender,
          age,
          recommendations,
          imageUrl: imageUri || undefined, // Incluir URL de imagen
        };

        await saveAnalysis(analysis, imageUri || undefined);

        showEmotionEmoji(emotion.emotion);

        setTimeout(() => {
          Alert.alert(
            '¡Análisis Completo!',
            `Emoción: ${emotion.emotion}\nGénero: ${gender.gender}\nEdad: ${age.age} años\n\nRevisá el historial para ver las recomendaciones`,
            [{ text: 'OK' }]
          );
        }, 500);

      } catch (error) {
        console.error('[v0] Error en análisis:', error);
        Alert.alert('Error', 'No se pudo guardar el análisis');
      } finally {
        setAnalyzing(false);
      }
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análisis Facial</Text>
        <Text style={styles.headerSubtitle}>Posiciona tu rostro en el centro</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.faceGuide} />

            {showEmoji && detectedEmotion && (
              <Animated.View
                style={[
                  styles.emojiContainer,
                  {
                    transform: [{ scale: emojiScale }]
                  }
                ]}
              >
                <Text style={styles.emojiText}>
                  {emotionEmojis[detectedEmotion] || '😊'}
                </Text>
                <Text style={styles.emojiLabel}>
                  {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}
                </Text>
              </Animated.View>
            )}

            {analyzing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Analizando...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={toggleCameraFacing}
          disabled={analyzing}
        >
          <RotateCcw size={24} color="#6b7280" />
          <Text style={styles.secondaryButtonText}>Voltear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analyzeButton, analyzing && styles.analyzeButtonDisabled]}
          onPress={analyzeImage}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.analyzeButtonText}>Analizando...</Text>
            </>
          ) : (
            <>
              <Sparkles size={28} color="#ffffff" />
              <Text style={styles.analyzeButtonText}>Analizar Rostro</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.secondaryButton} />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          El análisis detectará tu emoción, género y edad para recomendarte productos de cuidado de piel personalizados
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 240,
    height: 320,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 120,
    borderStyle: 'dashed',
  },
  emojiContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  emojiText: {
    fontSize: 40,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
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
    gap: 12,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#6b7280',
    shadowColor: '#000000',
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  info: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f9fafb',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
