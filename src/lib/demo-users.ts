import bcrypt from 'bcryptjs';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  passwordPlain: string;
  passwordHash?: string;
  avatar: string;
  fitnessGoal: string;
  experienceLevel: string;
  heightCm: number;
  weightKg: number;
  preferredDays: number;
  preferredDuration: number;
  equipmentAccess: string;
  xp: number;
  level: number;
  streakDays: number;
  lastWorkoutDate?: string;
  createdAt: string;
}

export const DEMO_USERS: Record<string, DemoUser> = {
  'user@fitai.app': {
    id: 'demo-user-athlete-id-001',
    email: 'user@fitai.app',
    name: 'Alex Rivera',
    role: 'USER',
    passwordPlain: 'User@123456',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    fitnessGoal: 'strength',
    experienceLevel: 'intermediate',
    heightCm: 178,
    weightKg: 78,
    preferredDays: 4,
    preferredDuration: 60,
    equipmentAccess: 'full_gym',
    xp: 850,
    level: 3,
    streakDays: 5,
    createdAt: new Date().toISOString(),
  },
  'admin@fitai.app': {
    id: 'demo-admin-master-id-002',
    email: 'admin@fitai.app',
    name: 'FitAI Administrator',
    role: 'ADMIN',
    passwordPlain: 'Admin@123456',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fitnessGoal: 'muscle_building',
    experienceLevel: 'advanced',
    heightCm: 182,
    weightKg: 85,
    preferredDays: 5,
    preferredDuration: 60,
    equipmentAccess: 'full_gym',
    xp: 2450,
    level: 9,
    streakDays: 14,
    createdAt: new Date().toISOString(),
  },
};

export function findDemoUser(email: string): DemoUser | null {
  const normalized = email.toLowerCase().trim();
  return DEMO_USERS[normalized] || null;
}

export function isDemoPasswordValid(demoUser: DemoUser, inputPassword: string): boolean {
  if (inputPassword === demoUser.passwordPlain) return true;
  // Allow common testing passwords for instant access
  if (['password', 'admin', 'user', 'demo', '123456', 'User@123456', 'Admin@123456'].includes(inputPassword)) {
    return true;
  }
  return false;
}

export const FALLBACK_WORKOUTS = [
  {
    id: 'push-day-hypertrophy',
    name: 'Push Day (Chest, Shoulders & Triceps)',
    slug: 'push-day-hypertrophy',
    description: 'High-intensity pushing session maximizing mechanical tension on pectorals, anterior deltoids, and triceps.',
    category: 'push_pull_legs',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    isTemplate: true,
    isPublic: true,
    tags: 'chest, shoulders, triceps, push, ppl',
    exercises: [
      { id: 'we-1', orderIndex: 0, targetSets: 4, targetReps: '6-8', targetRestSec: 120, tempo: '3-1-1-0', notes: 'Primary compound press.', exercise: { name: 'Barbell Bench Press', slug: 'barbell-bench-press', primaryMuscle: 'Chest', equipment: 'Barbell' } },
      { id: 'we-2', orderIndex: 1, targetSets: 3, targetReps: '8-10', targetRestSec: 90, tempo: '2-0-1-0', notes: 'Vertical pressing volume.', exercise: { name: 'Overhead Press (OHP)', slug: 'overhead-press', primaryMuscle: 'Shoulders', equipment: 'Barbell' } },
      { id: 'we-3', orderIndex: 2, targetSets: 3, targetReps: '12-15', targetRestSec: 60, tempo: '2-0-1-1', notes: 'Spread rope ends at lockout.', exercise: { name: 'Triceps Rope Pushdown', slug: 'triceps-rope-pushdown', primaryMuscle: 'Triceps', equipment: 'Cable' } },
    ]
  },
  {
    id: 'pull-day-hypertrophy',
    name: 'Pull Day (Back, Rear Delts & Biceps)',
    slug: 'pull-day-hypertrophy',
    description: 'Complete pulling routine targeting lat width, upper back thickness, and peak bicep recruitment.',
    category: 'push_pull_legs',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    isTemplate: true,
    isPublic: true,
    tags: 'back, biceps, pull, lats, ppl',
    exercises: [
      { id: 'we-4', orderIndex: 0, targetSets: 3, targetReps: '5', targetRestSec: 180, tempo: '2-0-1-0', notes: 'Heavy posterior chain pull.', exercise: { name: 'Conventional Deadlift', slug: 'conventional-deadlift', primaryMuscle: 'Back', equipment: 'Barbell' } },
      { id: 'we-5', orderIndex: 1, targetSets: 4, targetReps: '8-10', targetRestSec: 90, tempo: '2-1-1-0', notes: 'Pull bar to navel.', exercise: { name: 'Barbell Bent-Over Row', slug: 'barbell-bent-over-row', primaryMuscle: 'Back', equipment: 'Barbell' } },
      { id: 'we-6', orderIndex: 2, targetSets: 3, targetReps: '10-12', targetRestSec: 75, tempo: '2-1-1-0', notes: 'Squeeze lats at bottom.', exercise: { name: 'Lat Pulldown', slug: 'lat-pulldown', primaryMuscle: 'Back', equipment: 'Cable' } },
    ]
  },
  {
    id: 'legs-core-blast',
    name: 'Legs & Core Blast',
    slug: 'legs-core-blast',
    description: 'Comprehensive lower body workout developing quadriceps, hamstrings, glutes, and core bracing.',
    category: 'push_pull_legs',
    difficulty: 'Intermediate',
    durationMinutes: 55,
    isTemplate: true,
    isPublic: true,
    tags: 'legs, quads, hamstrings, glutes, calves',
    exercises: [
      { id: 'we-7', orderIndex: 0, targetSets: 4, targetReps: '6-8', targetRestSec: 150, tempo: '3-1-1-0', notes: 'Full depth below parallel.', exercise: { name: 'Barbell Back Squat', slug: 'barbell-back-squat', primaryMuscle: 'Quadriceps', equipment: 'Barbell' } },
      { id: 'we-8', orderIndex: 1, targetSets: 3, targetReps: '8-10', targetRestSec: 120, tempo: '3-1-1-0', notes: 'Deep hamstring stretch.', exercise: { name: 'Romanian Deadlift (RDL)', slug: 'romanian-deadlift', primaryMuscle: 'Hamstrings', equipment: 'Barbell' } },
    ]
  }
];

export const FALLBACK_ANALYTICS = {
  summary: {
    totalWorkouts: 24,
    totalVolumeKg: 84500,
    totalSets: 340,
    totalReps: 3120,
    streakDays: 5,
    level: 3,
    xp: 850,
  },
  recentVolume: [
    { date: 'Mon', volume: 14200 },
    { date: 'Tue', volume: 11500 },
    { date: 'Wed', volume: 0 },
    { date: 'Thu', volume: 16800 },
    { date: 'Fri', volume: 15400 },
    { date: 'Sat', volume: 18200 },
    { date: 'Sun', volume: 8400 },
  ],
  prs: [
    { exerciseName: 'Barbell Bench Press', value: 100, recordType: 'HEAVIEST_WEIGHT', achievedAt: new Date().toISOString() },
    { exerciseName: 'Barbell Back Squat', value: 140, recordType: 'HEAVIEST_WEIGHT', achievedAt: new Date().toISOString() },
    { exerciseName: 'Conventional Deadlift', value: 180, recordType: 'HEAVIEST_WEIGHT', achievedAt: new Date().toISOString() },
    { exerciseName: 'Overhead Press (OHP)', value: 65, recordType: 'HEAVIEST_WEIGHT', achievedAt: new Date().toISOString() },
  ],
  muscleDistribution: [
    { muscle: 'Chest', percentage: 25 },
    { muscle: 'Back', percentage: 22 },
    { muscle: 'Quadriceps', percentage: 20 },
    { muscle: 'Shoulders', percentage: 15 },
    { muscle: 'Hamstrings', percentage: 10 },
    { muscle: 'Arms', percentage: 8 },
  ]
};
