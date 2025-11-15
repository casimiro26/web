import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '@/types/analysis';

const STORAGE_KEY = '@skin_analysis_history';

export async function saveAnalysis(analysis: AnalysisResult): Promise<void> {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const history: AnalysisResult[] = existingData ? JSON.parse(existingData) : [];
    history.unshift(analysis);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
}

export async function getAnalysisHistory(): Promise<AnalysisResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const history: AnalysisResult[] = existingData ? JSON.parse(existingData) : [];
    const filtered = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw error;
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}
