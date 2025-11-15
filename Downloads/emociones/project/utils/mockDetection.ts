import { EmotionDetection, GenderDetection, AgeDetection } from '@/types/analysis';

export function simulateEmotionDetection(): EmotionDetection {
  const emotions: EmotionDetection['emotion'][] = [
    'feliz', 'triste', 'enojado', 'sorprendido', 'neutral', 'miedo', 'disgusto'
  ];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  return {
    emotion,
    confidence: Math.random() * 0.3 + 0.7
  };
}

export function simulateGenderDetection(): GenderDetection {
  const gender: GenderDetection['gender'] = Math.random() > 0.5 ? 'hombre' : 'mujer';
  return {
    gender,
    confidence: Math.random() * 0.2 + 0.8
  };
}

export function simulateAgeDetection(): AgeDetection {
  const age = Math.floor(Math.random() * 50) + 18;
  let ageRange: string;

  if (age < 25) {
    ageRange = '18-24 años';
  } else if (age < 35) {
    ageRange = '25-34 años';
  } else if (age < 45) {
    ageRange = '35-44 años';
  } else if (age < 55) {
    ageRange = '45-54 años';
  } else {
    ageRange = '55+ años';
  }

  return { age, ageRange };
}
