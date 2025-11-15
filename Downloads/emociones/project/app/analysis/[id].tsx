import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Smile, Frown, Angry, Surprised, Meh, Skull, ThumbsDown, User, Calendar, Sparkles } from 'lucide-react-native';
import { getAnalysisHistory } from '@/services/storageService';
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

export default function AnalysisDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [id]);

  async function loadAnalysis() {
    const history = await getAnalysisHistory();
    const found = history.find(item => item.id === id);
    setAnalysis(found || null);
  }

  if (!analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Análisis no encontrado</Text>
        </View>
      </View>
    );
  }

  const EmotionIcon = emotionIcons[analysis.emotion.emotion];
  const emotionColor = emotionColors[analysis.emotion.emotion];

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Análisis</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.emotionCard, { backgroundColor: emotionColor + '15' }]}>
          <View style={[styles.emotionIconContainer, { backgroundColor: emotionColor + '30' }]}>
            <EmotionIcon size={48} color={emotionColor} />
          </View>
          <Text style={[styles.emotionTitle, { color: emotionColor }]}>
            {analysis.emotion.emotion.charAt(0).toUpperCase() + analysis.emotion.emotion.slice(1)}
          </Text>
          <Text style={styles.confidenceText}>
            Confianza: {(analysis.emotion.confidence * 100).toFixed(0)}%
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <User size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Género</Text>
                <Text style={styles.infoValue}>
                  {analysis.gender.gender === 'hombre' ? 'Hombre' : 'Mujer'}
                </Text>
                <Text style={styles.infoConfidence}>
                  Confianza: {(analysis.gender.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>{analysis.age.age} años</Text>
                <Text style={styles.infoConfidence}>Rango: {analysis.age.ageRange}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recommendationsSection}>
          <View style={styles.recommendationsHeader}>
            <Sparkles size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
          </View>

          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Text style={styles.recommendationCategory}>
                {recommendation.category}
              </Text>
              <Text style={styles.recommendationReason}>
                {recommendation.reason}
              </Text>
              <View style={styles.productsList}>
                {recommendation.products.map((product, pIndex) => (
                  <View key={pIndex} style={styles.productItem}>
                    <View style={styles.productBullet} />
                    <Text style={styles.productText}>{product}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            Análisis realizado el {formatDate(analysis.timestamp)}
          </Text>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  emotionCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emotionIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emotionTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  infoConfidence: {
    fontSize: 13,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendationCategory: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  recommendationReason: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  productsList: {
    gap: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginTop: 6,
    marginRight: 12,
  },
  productText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  dateContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
