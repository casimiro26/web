import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Smile, Frown, Angry, Surprised, Meh, Skull, ThumbsDown, Trash2, ChevronRight } from 'lucide-react-native';
import { getAnalysisHistory, deleteAnalysis, clearHistory } from '@/services/storageService';
import { AnalysisResult } from '@/types/analysis';

const emotionIcons = {
  feliz: Smile,
  triste: Frown,
  enojado: Angry,
  sorprendido: Surprised,
  neutral: Meh,
  miedo: Skull,
  disgusto: ThumbsDown,
};

const emotionColors = {
  feliz: '#10b981',
  triste: '#3b82f6',
  enojado: '#ef4444',
  sorprendido: '#f59e0b',
  neutral: '#6b7280',
  miedo: '#8b5cf6',
  disgusto: '#ec4899',
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Eliminar análisis',
      '¿Estás seguro de que querés eliminar este análisis?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnalysis(id);
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el análisis');
            }
          },
        },
      ]
    );
  }

  async function handleClearAll() {
    if (history.length === 0) return;

    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que querés eliminar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'No se pudo limpiar el historial');
            }
          },
        },
      ]
    );
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // CORRECCIÓN: Usar useCallback para evitar recreaciones innecesarias
  const renderItem = useCallback(({ item }: { item: AnalysisResult }) => {
    // CORRECCIÓN: Validar que el ícono existe antes de renderizar
    const EmotionIcon = emotionIcons[item.emotion.emotion];
    const emotionColor = emotionColors[item.emotion.emotion];

    // Si no existe el ícono, usar uno por defecto
    const IconComponent = EmotionIcon || Meh;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => router.push(`/analysis/${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={[styles.emotionBadge, { backgroundColor: `${emotionColor}20` }]}>
            <IconComponent size={28} color={emotionColor} />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.emotionText}>
              {item.emotion.emotion.charAt(0).toUpperCase() + item.emotion.emotion.slice(1)}
            </Text>
            <Text style={styles.detailsText}>
              {item.gender?.gender === 'hombre' ? 'Hombre' : 'Mujer'} • {item.age?.age || 'N/A'} años
            </Text>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>

          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.6}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  }, [router]);

  // CORRECCIÓN: Usar useCallback para keyExtractor
  const keyExtractor = useCallback((item: AnalysisResult) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Historial</Text>
          <Text style={styles.headerSubtitle}>
            {history.length} {history.length === 1 ? 'análisis' : 'análisis'}
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#ef4444" />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Smile size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Sin análisis</Text>
          <Text style={styles.emptyText}>
            Comenzá analizando tu rostro en la pestaña de Análisis
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emotionBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  emotionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});