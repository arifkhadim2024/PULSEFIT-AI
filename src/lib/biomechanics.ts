export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  bmr: number;
  tdee: number;
}

export interface CalculateTdeeParams {
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'fat_loss' | 'maintenance' | 'muscle_gain' | 'strength';
}

/**
 * 1RM Estimations using standard scientific formulas
 */
export function calculate1RM(weightKg: number, reps: number): {
  epley: number;
  brzycki: number;
  lander: number;
  average: number;
} {
  if (reps <= 1) {
    return { epley: weightKg, brzycki: weightKg, lander: weightKg, average: weightKg };
  }
  
  // Epley formula: w * (1 + r / 30)
  const epley = Math.round(weightKg * (1 + reps / 30) * 10) / 10;
  // Brzycki formula: w * (36 / (37 - r))
  const brzycki = Math.round(weightKg * (36 / (37 - Math.min(reps, 36))) * 10) / 10;
  // Lander formula: (100 * w) / (101.3 - 2.67123 * r)
  const lander = Math.round(((100 * weightKg) / (101.3 - 2.67123 * reps)) * 10) / 10;
  
  const average = Math.round(((epley + brzycki + lander) / 3) * 10) / 10;
  
  return { epley, brzycki, lander, average };
}

/**
 * Mifflin-St Jeor BMR & TDEE calculation
 */
export function calculateTDEE(params: CalculateTdeeParams): MacroBreakdown {
  const { gender, weightKg, heightCm, age, activityLevel, goal } = params;

  // Mifflin - St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const activityMultipliers = {
    sedentary: 1.2, // Desk job, little exercise
    light: 1.375, // 1-3 workouts / week
    moderate: 1.55, // 3-5 workouts / week
    active: 1.725, // 6-7 hard workouts / week
    very_active: 1.9, // Athlete / 2x daily training
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.4));

  // Adjust for goal
  let targetCalories = tdee;
  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.80); // 20% deficit
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
  } else if (goal === 'strength') {
    targetCalories = Math.round(tdee * 1.05); // slight surplus
  }

  // Macronutrient split
  // Protein: ~2.0g to 2.2g per kg bodyweight
  const proteinGrams = Math.round(weightKg * 2.2);
  const proteinCalories = proteinGrams * 4;

  // Fats: ~25-30% of total daily calories
  const fatsCalories = Math.round(targetCalories * 0.25);
  const fatsGrams = Math.round(fatsCalories / 9);

  // Carbohydrates: Remaining calories
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatsCalories));
  const carbsGrams = Math.round(remainingCalories / 4);

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    bmr: Math.round(bmr),
    tdee,
  };
}

export const MUSCLE_GROUPS = [
  { id: 'Chest', name: 'Chest (Pectorals)', region: 'front', count: 12 },
  { id: 'Back', name: 'Back (Lats, Upper/Mid Back)', region: 'back', count: 14 },
  { id: 'Shoulders', name: 'Shoulders (Deltoids)', region: 'front', count: 10 },
  { id: 'Biceps', name: 'Biceps Brachii', region: 'front', count: 8 },
  { id: 'Triceps', name: 'Triceps Brachii', region: 'back', count: 8 },
  { id: 'Forearms', name: 'Forearms & Grip', region: 'front', count: 5 },
  { id: 'Abs', name: 'Abs & Core', region: 'front', count: 10 },
  { id: 'Glutes', name: 'Glutes (Maximus & Medius)', region: 'back', count: 8 },
  { id: 'Quadriceps', name: 'Quadriceps', region: 'front', count: 10 },
  { id: 'Hamstrings', name: 'Hamstrings', region: 'back', count: 8 },
  { id: 'Calves', name: 'Calves (Gastrocnemius & Soleus)', region: 'back', count: 6 },
  { id: 'Traps', name: 'Trapezius', region: 'back', count: 5 },
  { id: 'Lower Back', name: 'Lower Back (Erector Spinae)', region: 'back', count: 5 },
  { id: 'Adductors', name: 'Inner Thighs (Adductors)', region: 'front', count: 4 },
  { id: 'Abductors', name: 'Outer Hips (Abductors)', region: 'front', count: 4 },
];

export const EQUIPMENT_LIST = [
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Kettlebell',
  'Bodyweight',
  'Resistance Band',
  'Smith Machine',
  'Bench',
];
