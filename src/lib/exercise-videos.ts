/**
 * Video Mapping Engine for Kaggle Dataset (hasyimabdillah/workoutfitness-video)
 * Maps all 117+ exercises to high-quality video demonstrations.
 */

export const KAGGLE_EXERCISE_VIDEOS: Record<string, string> = {
  // Chest
  'barbell-bench-press': '/videos/exercises/bench-press.mp4',
  'dumbbell-bench-press': '/videos/exercises/bench-press.mp4',
  'incline-dumbbell-press': '/videos/exercises/incline-bench-press.mp4',
  'incline-barbell-bench-press': '/videos/exercises/incline-bench-press.mp4',
  'decline-barbell-bench-press': '/videos/exercises/decline-bench-press.mp4',
  'decline-dumbbell-bench-press': '/videos/exercises/decline-bench-press.mp4',
  'cable-chest-fly': '/videos/exercises/chest-fly-machine.mp4',
  'pec-deck-machine': '/videos/exercises/chest-fly-machine.mp4',
  'push-ups': '/videos/exercises/push-up.mp4',
  'diamond-push-ups': '/videos/exercises/push-up.mp4',
  'chest-dips': '/videos/exercises/tricep-dips.mp4',
  'machine-chest-press': '/videos/exercises/bench-press.mp4',

  // Back & Lats
  'conventional-deadlift': '/videos/exercises/deadlift.mp4',
  'sumo-deadlift': '/videos/exercises/deadlift.mp4',
  'trap-bar-deadlift': '/videos/exercises/deadlift.mp4',
  'barbell-bent-over-row': '/videos/exercises/t-bar-row.mp4',
  'pendlay-row': '/videos/exercises/t-bar-row.mp4',
  't-bar-row': '/videos/exercises/t-bar-row.mp4',
  'single-arm-dumbbell-row': '/videos/exercises/t-bar-row.mp4',
  'seated-cable-row': '/videos/exercises/t-bar-row.mp4',
  'pull-ups': '/videos/exercises/pull-up.mp4',
  'chin-ups': '/videos/exercises/pull-up.mp4',
  'lat-pulldown': '/videos/exercises/lat-pulldown.mp4',
  'close-grip-lat-pulldown': '/videos/exercises/lat-pulldown.mp4',
  'straight-arm-cable-pulldown': '/videos/exercises/lat-pulldown.mp4',
  'chest-supported-row': '/videos/exercises/t-bar-row.mp4',

  // Shoulders & Deltoids
  'overhead-press': '/videos/exercises/shoulder-press.mp4',
  'seated-dumbbell-shoulder-press': '/videos/exercises/shoulder-press.mp4',
  'arnold-press': '/videos/exercises/shoulder-press.mp4',
  'military-press': '/videos/exercises/shoulder-press.mp4',
  'dumbbell-lateral-raise': '/videos/exercises/lateral-raise.mp4',
  'cable-lateral-raise': '/videos/exercises/lateral-raise.mp4',
  'rear-delt-dumbbell-fly': '/videos/exercises/lateral-raise.mp4',
  'face-pull': '/videos/exercises/t-bar-row.mp4',
  'dumbbell-front-raise': '/videos/exercises/lateral-raise.mp4',
  'barbell-upright-row': '/videos/exercises/t-bar-row.mp4',

  // Biceps & Forearms
  'barbell-bicep-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'ez-bar-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'incline-dumbbell-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'preacher-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'hammer-curl': '/videos/exercises/hammer-curl.mp4',
  'cable-rope-hammer-curl': '/videos/exercises/hammer-curl.mp4',
  'concentration-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'spider-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'reverse-barbell-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'barbell-wrist-curl': '/videos/exercises/barbell-biceps-curl.mp4',
  'farmers-walk': '/videos/exercises/deadlift.mp4',

  // Triceps
  'close-grip-bench-press': '/videos/exercises/bench-press.mp4',
  'triceps-rope-pushdown': '/videos/exercises/tricep-pushdown.mp4',
  'straight-bar-tricep-pushdown': '/videos/exercises/tricep-pushdown.mp4',
  'skull-crushers': '/videos/exercises/tricep-pushdown.mp4',
  'overhead-cable-triceps-extension': '/videos/exercises/tricep-pushdown.mp4',
  'overhead-dumbbell-triceps-extension': '/videos/exercises/tricep-pushdown.mp4',
  'tricep-dips': '/videos/exercises/tricep-dips.mp4',
  'bench-dips': '/videos/exercises/tricep-dips.mp4',

  // Quadriceps & Glutes & Legs
  'barbell-back-squat': '/videos/exercises/squat.mp4',
  'front-squat': '/videos/exercises/squat.mp4',
  'goblet-squat': '/videos/exercises/squat.mp4',
  'hack-squat': '/videos/exercises/squat.mp4',
  'leg-press': '/videos/exercises/squat.mp4',
  'bulgarian-split-squat': '/videos/exercises/squat.mp4',
  'walking-lunges': '/videos/exercises/squat.mp4',
  'leg-extension': '/videos/exercises/leg-extension.mp4',
  'leg-extension-machine': '/videos/exercises/leg-extension.mp4',
  'sissy-squat': '/videos/exercises/leg-extension.mp4',
  'barbell-hip-thrust': '/videos/exercises/hip-thrust.mp4',
  'dumbbell-hip-thrust': '/videos/exercises/hip-thrust.mp4',
  'glute-bridge': '/videos/exercises/hip-thrust.mp4',
  'cable-glute-kickback': '/videos/exercises/hip-thrust.mp4',

  // Hamstrings & Calves
  'romanian-deadlift': '/videos/exercises/romanian-deadlift.mp4',
  'stiff-leg-deadlift': '/videos/exercises/romanian-deadlift.mp4',
  'lying-leg-curl': '/videos/exercises/leg-extension.mp4',
  'seated-leg-curl': '/videos/exercises/leg-extension.mp4',
  'nordic-hamstring-curl': '/videos/exercises/romanian-deadlift.mp4',
  'good-mornings': '/videos/exercises/romanian-deadlift.mp4',
  'standing-calf-raise': '/videos/exercises/squat.mp4',
  'seated-calf-raise': '/videos/exercises/squat.mp4',
  'donkey-calf-raise': '/videos/exercises/squat.mp4',
  'tibialis-anterior-raise': '/videos/exercises/squat.mp4',

  // Abs & Core
  'plank': '/videos/exercises/plank.mp4',
  'side-plank': '/videos/exercises/plank.mp4',
  'ab-wheel-rollout': '/videos/exercises/plank.mp4',
  'hanging-leg-raise': '/videos/exercises/leg-raises.mp4',
  'lying-leg-raise': '/videos/exercises/leg-raises.mp4',
  'captain-chair-leg-raise': '/videos/exercises/leg-raises.mp4',
  'cable-woodchoppers': '/videos/exercises/russian-twist.mp4',
  'russian-twist': '/videos/exercises/russian-twist.mp4',
  'cable-crunch': '/videos/exercises/plank.mp4',
  'dead-bug': '/videos/exercises/plank.mp4',
};

/**
 * Returns the best video demonstration URL from the Kaggle dataset for any exercise
 */
export function getExerciseVideoUrl(slug: string, primaryMuscle?: string, movementPattern?: string): string {
  if (KAGGLE_EXERCISE_VIDEOS[slug]) {
    return KAGGLE_EXERCISE_VIDEOS[slug];
  }

  // Fallback by primary muscle or movement pattern
  const muscle = (primaryMuscle || '').toLowerCase();
  const pattern = (movementPattern || '').toLowerCase();

  if (muscle.includes('chest') || pattern.includes('horizontal push')) {
    return '/videos/exercises/bench-press.mp4';
  }
  if (muscle.includes('quad') || pattern.includes('squat')) {
    return '/videos/exercises/squat.mp4';
  }
  if (muscle.includes('hamstring') || muscle.includes('lower back') || pattern.includes('hinge')) {
    return '/videos/exercises/romanian-deadlift.mp4';
  }
  if (muscle.includes('glute') || muscle.includes('hip')) {
    return '/videos/exercises/hip-thrust.mp4';
  }
  if (muscle.includes('shoulder') || pattern.includes('vertical push')) {
    return '/videos/exercises/shoulder-press.mp4';
  }
  if (pattern.includes('vertical pull') || muscle.includes('lat')) {
    return '/videos/exercises/lat-pulldown.mp4';
  }
  if (pattern.includes('horizontal pull') || muscle.includes('back')) {
    return '/videos/exercises/t-bar-row.mp4';
  }
  if (muscle.includes('bicep') || muscle.includes('forearm')) {
    return '/videos/exercises/barbell-biceps-curl.mp4';
  }
  if (muscle.includes('tricep')) {
    return '/videos/exercises/tricep-pushdown.mp4';
  }
  if (muscle.includes('abs') || muscle.includes('core')) {
    return '/videos/exercises/plank.mp4';
  }

  return '/videos/exercises/bench-press.mp4';
}
