import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, Filter } from 'lucide-react-native';

// Interface que coincide con tu backend
interface BackendData {
  id: number;
  idUsuario: string;
  marcaTiempo: string;
  horasMonitoreadas: number;
  eventosTotales: number;
  eventosCriticos: number;
  movimiento: string;
  promedio: number;
}

type TimeFilter = 'today' | 'week' | 'month' | 'year' | 'all';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [events, setEvents] = useState<BackendData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<BackendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const loadEvents = async () => {
    if (!user) {
      setError('Usuario no autenticado');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token');

      const response = await fetch('https://api-app-android-studio-tesis.onrender.com/datos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // El backend devuelve un array directo
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents(data.datos || data.eventos || []);
      }
      setError(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error loading events:', error);
      setError(error.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, timeFilter]);

  const filterEvents = () => {
    const now = new Date();
    let filtered = events;
    
    switch (timeFilter) {
      case 'today':
        filtered = events.filter(e => {
          const eventDate = new Date(e.marcaTiempo);
          return eventDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = events.filter(e => new Date(e.marcaTiempo) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = events.filter(e => new Date(e.marcaTiempo) >= monthAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filtered = events.filter(e => new Date(e.marcaTiempo) >= yearAgo);
        break;
      case 'all':
      default:
        filtered = events;
    }
    setFilteredEvents(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const filters: { key: TimeFilter; label: string }[] = [
    { key: 'today', label: 'Hoy' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: 'year', label: 'Año' },
    { key: 'all', label: 'Todo' },
  ];

  const groupEventsByDate = () => {
    const grouped: { [key: string]: BackendData[] } = {};
    filteredEvents.forEach(event => {
      const date = new Date(event.marcaTiempo).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

  // Calcular estadísticas
  const totalCritical = filteredEvents.reduce((sum, e) => sum + e.eventosCriticos, 0);
  const totalEvents = filteredEvents.reduce((sum, e) => sum + e.eventosTotales, 0);
  const totalNormal = totalEvents - totalCritical;

  const getEventType = (movimiento: string) => {
    return movimiento === 'sí' ? 'DETECCIÓN DE MOVIMIENTO' : 'SIN MOVIMIENTO';
  };

  const getStatus = (eventosCriticos: number, eventosTotales: number) => {
    const porcentajeCritico = eventosTotales > 0 ? (eventosCriticos / eventosTotales) * 100 : 0;
    if (porcentajeCritico > 50) return 'critical';
    if (porcentajeCritico > 20) return 'warning';
    return 'normal';
  };

  const getStatusInSpanish = (status: string) => {
    switch (status) {
      case 'critical': return 'Crítico';
      case 'warning': return 'Advertencia';
      case 'normal': return 'Normal';
      default: return status;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.titleContainer}>
          <Calendar size={28} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>Registro Histórico</Text>
        </View>
      </View>
      
      <View style={styles.periodSelector}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.periodButton,
              timeFilter === filter.key && styles.periodButtonActive,
            ]}
            onPress={() => setTimeFilter(filter.key as TimeFilter)}
          >
            <Text
              style={[
                styles.periodButtonText,
                timeFilter === filter.key && styles.periodButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={[styles.statsBar, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{filteredEvents.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sesiones</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.error }]}>{totalCritical}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Críticos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{totalNormal}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Normales</Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        ) : loading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Cargando sesiones...</Text>
          </View>
        ) : Object.keys(groupedEvents).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Filter size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No hay sesiones en este período
            </Text>
          </View>
        ) : (
          Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.text }]}>{date}</Text>
              {dateEvents.map((event, index) => {
                const status = getStatus(event.eventosCriticos, event.eventosTotales);
                return (
                  <View
                    key={event.id || `event-${index}`}
                    style={[styles.eventCard, { backgroundColor: colors.card }]}
                  >
                    <View style={styles.eventHeader}>
                      <View style={styles.eventTitleRow}>
                        <Text style={[styles.eventType, { color: colors.text }]}>
                          {getEventType(event.movimiento)}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                status === 'critical'
                                  ? (colors.error || '#FF0000') + '20'
                                  : status === 'warning'
                                  ? (colors.warning || '#FF9500') + '20'
                                  : (colors.success || '#34C759') + '20',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  status === 'critical'
                                    ? colors.error || '#FF0000'
                                    : status === 'warning'
                                    ? colors.warning || '#FF9500'
                                    : colors.success || '#34C759',
                              },
                            ]}
                          >
                            {getStatusInSpanish(status)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                      {`Horas: ${event.horasMonitoreadas}h | Total: ${event.eventosTotales} | Críticos: ${event.eventosCriticos}`}
                    </Text>
                    <View style={styles.eventFooter}>
                      <Text style={[styles.eventValue, { color: colors.text }]}>
                        Criticidad: {event.promedio}%
                      </Text>
                      <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                        {new Date(event.marcaTiempo).toLocaleTimeString('es-ES')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// Los estilos se mantienen igual...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  periodButtonText: { fontSize: 10, fontWeight: '600' },
  periodButtonTextActive: { color: '#ffffff' },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  scrollView: { flex: 1 },
  dateGroup: { marginBottom: 24 },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventHeader: { marginBottom: 8 },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventType: { fontSize: 16, fontWeight: '600', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  eventDescription: { fontSize: 14, marginBottom: 8 },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventValue: { fontSize: 14, fontWeight: '600' },
  eventTime: { fontSize: 12 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 16, marginTop: 16 },
  errorText: { fontSize: 16, textAlign: 'center', marginVertical: 10 },
  bottomPadding: { height: 40 },
});