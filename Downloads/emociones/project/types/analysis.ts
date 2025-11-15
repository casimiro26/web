export interface EmotionDetection {
  emotion: 'feliz' | 'triste' | 'enojado' | 'sorprendido' | 'neutral' | 'miedo' | 'disgusto';
  confidence: number;
}

export interface GenderDetection {
  gender: 'hombre' | 'mujer';
  confidence: number;
}

export interface AgeDetection {
  age: number;
  ageRange: string;
}

export interface SkinRecommendation {
  category: string;
  products: string[];
  reason: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  emotion: EmotionDetection;
  gender: GenderDetection;
  age: AgeDetection;
  recommendations: SkinRecommendation[];
  imageUri?: string;
}
