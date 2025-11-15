import { SkinRecommendation, EmotionDetection, GenderDetection, AgeDetection } from '@/types/analysis';

export function generateRecommendations(
  emotion: EmotionDetection,
  gender: GenderDetection,
  age: AgeDetection
): SkinRecommendation[] {
  const recommendations: SkinRecommendation[] = [];

  if (age.age < 25) {
    recommendations.push({
      category: 'Limpieza',
      products: ['Gel limpiador suave', 'Tónico sin alcohol', 'Exfoliante enzimático'],
      reason: 'Piel joven necesita limpieza suave para mantener balance natural'
    });
    recommendations.push({
      category: 'Hidratación',
      products: ['Hidratante libre de aceite', 'Sérum de ácido hialurónico', 'Protector solar SPF 30+'],
      reason: 'Prevenir signos tempranos de envejecimiento'
    });
  } else if (age.age >= 25 && age.age < 40) {
    recommendations.push({
      category: 'Anti-edad preventivo',
      products: ['Sérum con vitamina C', 'Crema con retinol', 'Contorno de ojos', 'Protector solar SPF 50+'],
      reason: 'Prevenir y tratar primeros signos de envejecimiento'
    });
    recommendations.push({
      category: 'Hidratación profunda',
      products: ['Crema hidratante con ceramidas', 'Sérum de ácido hialurónico', 'Mascarilla hidratante semanal'],
      reason: 'Mantener elasticidad y firmeza de la piel'
    });
  } else {
    recommendations.push({
      category: 'Anti-edad intensivo',
      products: ['Sérum con péptidos', 'Crema reafirmante', 'Tratamiento con retinol', 'Protector solar SPF 50+'],
      reason: 'Reducir arrugas y mejorar firmeza'
    });
    recommendations.push({
      category: 'Nutrición profunda',
      products: ['Crema nutritiva rica', 'Aceite facial', 'Mascarilla regeneradora', 'Sérum antioxidante'],
      reason: 'Nutrición intensiva para piel madura'
    });
  }

  if (emotion.emotion === 'triste' || emotion.emotion === 'miedo') {
    recommendations.push({
      category: 'Cuidado especial',
      products: ['Mascarilla iluminadora', 'Sérum con vitamina C', 'Crema para ojeras'],
      reason: 'El estrés emocional puede afectar la luminosidad de la piel'
    });
  }

  if (emotion.emotion === 'enojado') {
    recommendations.push({
      category: 'Cuidado calmante',
      products: ['Crema calmante con centella asiática', 'Spray facial relajante', 'Mascarilla de aloe vera'],
      reason: 'Reducir inflamación y enrojecimiento por tensión'
    });
  }

  if (gender.gender === 'hombre') {
    recommendations.push({
      category: 'Cuidado post-afeitado',
      products: ['Bálsamo after-shave', 'Crema antiirritación', 'Gel para barba'],
      reason: 'Proteger la piel del afeitado diario'
    });
  } else {
    recommendations.push({
      category: 'Cuidado específico',
      products: ['Sérum iluminador', 'Crema de noche reparadora', 'Mascarilla facial semanal'],
      reason: 'Mantener piel radiante y saludable'
    });
  }

  return recommendations;
}
