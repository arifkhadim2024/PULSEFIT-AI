export interface BadgeDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const SYSTEM_BADGES: BadgeDef[] = [
  {
    key: 'FIRST_WORKOUT',
    title: 'First Step to Greatness',
    description: 'Completed your very first workout session in FitPulse.',
    icon: '🏆',
    category: 'milestone',
  },
  {
    key: 'STREAK_3',
    title: 'Consistency Spark',
    description: 'Maintained a 3-day consecutive workout streak.',
    icon: '🔥',
    category: 'streak',
  },
  {
    key: 'STREAK_7',
    title: 'Iron Discipline',
    description: 'Maintained a 7-day workout streak without missing a beat.',
    icon: '⚡',
    category: 'streak',
  },
  {
    key: 'FIRST_PR',
    title: 'Breaking Boundaries',
    description: 'Set a new Personal Record on any compound or isolation exercise.',
    icon: '💥',
    category: 'strength',
  },
  {
    key: 'CENTURION_SETS',
    title: 'Centurion Lifter',
    description: 'Completed over 100 total working sets across all sessions.',
    icon: '🛡️',
    category: 'volume',
  },
  {
    key: 'TONNAGE_10K',
    title: '10,000kg Club',
    description: 'Moved over 10,000 kg in total cumulative workout volume.',
    icon: '🐘',
    category: 'volume',
  },
  {
    key: 'VARIETY_MASTER',
    title: 'Biomechanics Explorer',
    description: 'Performed at least 15 different exercises across all muscle groups.',
    icon: '🧬',
    category: 'mastery',
  },
  {
    key: 'AI_PIONEER',
    title: 'AI Smart Trainee',
    description: 'Generated and completed a customized AI workout program.',
    icon: '🤖',
    category: 'ai',
  },
];

export function calculateLevelFromXP(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  title: string;
} {
  // Level threshold: 250 XP per level with mild scaling
  const level = Math.floor(xp / 300) + 1;
  const currentLevelBase = (level - 1) * 300;
  const nextLevelXp = level * 300;
  const currentLevelXp = xp - currentLevelBase;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 300) * 100));

  let title = 'Iron Novice';
  if (level >= 20) title = 'Diamond Titan';
  else if (level >= 15) title = 'Platinum Athlete';
  else if (level >= 10) title = 'Gold Champion';
  else if (level >= 5) title = 'Silver Lifter';
  else if (level >= 2) title = 'Bronze Warrior';

  return {
    level,
    currentLevelXp,
    nextLevelXp: 300,
    progressPercent,
    title,
  };
}
