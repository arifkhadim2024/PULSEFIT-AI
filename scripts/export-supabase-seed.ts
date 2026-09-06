import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';
import { getExerciseVideoUrl } from '../src/lib/exercise-videos';

async function generateSupabaseSql() {
  console.log('Fetching exercises and templates from local database...');
  const exercises = await prisma.exercise.findMany({
    include: { media: true }
  });
  const workouts = await prisma.workout.findMany({
    include: { exercises: true }
  });

  let sql = `-- ==========================================================
-- FITPULSE AI — SUPABASE POSTGRESQL COMPLETE SCHEMA & DATASET
-- Project: https://hgwabvgqxcefmisgahku.supabase.co
-- 117 Gym Exercises, Media, Workout Programs, and Biomechanics
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "fitnessGoal" TEXT NOT NULL DEFAULT 'muscle_building',
    "experienceLevel" TEXT NOT NULL DEFAULT 'beginner',
    "heightCm" DOUBLE PRECISION DEFAULT 175,
    "weightKg" DOUBLE PRECISION DEFAULT 75,
    "preferredDays" INTEGER NOT NULL DEFAULT 4,
    "preferredDuration" INTEGER NOT NULL DEFAULT 45,
    "equipmentAccess" TEXT NOT NULL DEFAULT 'full_gym',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastWorkoutDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Exercise" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "primaryMuscle" TEXT NOT NULL,
    "secondaryMuscles" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "movementPattern" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "setupSteps" TEXT NOT NULL,
    "executionSteps" TEXT NOT NULL,
    "breathingInstructions" TEXT NOT NULL,
    "tempo" TEXT NOT NULL DEFAULT '3-0-1-0',
    "recommendedSets" TEXT NOT NULL DEFAULT '3-4',
    "recommendedReps" TEXT NOT NULL DEFAULT '8-12',
    "recommendedRestSec" INTEGER NOT NULL DEFAULT 90,
    "commonMistakes" TEXT NOT NULL,
    "safetyTips" TEXT NOT NULL,
    "beginnerAlternative" TEXT,
    "intermediateAlternative" TEXT,
    "advancedAlternative" TEXT,
    "tags" TEXT NOT NULL,
    "caloriesBurnPerHour" INTEGER NOT NULL DEFAULT 350,
    "isCustom" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ExerciseMedia" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "exerciseId" TEXT NOT NULL REFERENCES "Exercise"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'EXTERNAL',
    "durationSec" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Workout" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'strength',
    "difficulty" TEXT NOT NULL DEFAULT 'Intermediate',
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "isTemplate" BOOLEAN NOT NULL DEFAULT FALSE,
    "isPublic" BOOLEAN NOT NULL DEFAULT TRUE,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "WorkoutExercise" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "workoutId" TEXT NOT NULL REFERENCES "Workout"("id") ON DELETE CASCADE,
    "exerciseId" TEXT NOT NULL REFERENCES "Exercise"("id") ON DELETE CASCADE,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "targetSets" INTEGER NOT NULL DEFAULT 3,
    "targetReps" TEXT NOT NULL DEFAULT '8-12',
    "targetRestSec" INTEGER NOT NULL DEFAULT 90,
    "tempo" TEXT DEFAULT '3-0-1-0',
    "notes" TEXT
);

CREATE TABLE IF NOT EXISTS "WorkoutLog" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "workoutId" TEXT REFERENCES "Workout"("id") ON DELETE SET NULL,
    "workoutName" TEXT NOT NULL,
    "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "completedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "totalVolumeKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSets" INTEGER NOT NULL DEFAULT 0,
    "totalReps" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER DEFAULT 5,
    "notes" TEXT,
    "xpEarned" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "WorkoutSetLog" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "workoutLogId" TEXT NOT NULL REFERENCES "WorkoutLog"("id") ON DELETE CASCADE,
    "exerciseId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "rpe" DOUBLE PRECISION DEFAULT 8.0,
    "isPR" BOOLEAN NOT NULL DEFAULT FALSE,
    "completed" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PersonalRecord" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "exerciseId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "repsAchieved" INTEGER NOT NULL DEFAULT 1,
    "achievedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "BodyMeasurement" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "recordedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "weightKg" DOUBLE PRECISION,
    "chestCm" DOUBLE PRECISION,
    "waistCm" DOUBLE PRECISION,
    "armsCm" DOUBLE PRECISION,
    "thighsCm" DOUBLE PRECISION,
    "shouldersCm" DOUBLE PRECISION,
    "calvesCm" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ProgressPhoto" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "photoUrl" TEXT NOT NULL,
    "thumbnail" TEXT,
    "poseType" TEXT NOT NULL DEFAULT 'FRONT',
    "recordedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "isPrivate" BOOLEAN NOT NULL DEFAULT TRUE,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "badgeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "unlockedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "Achievement_userId_badgeKey_key" UNIQUE ("userId", "badgeKey")
);

CREATE TABLE IF NOT EXISTS "AIConversation" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL DEFAULT 'Fitness Consultation',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AIMessage" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "conversationId" TEXT NOT NULL REFERENCES "AIConversation"("id") ON DELETE CASCADE,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 3. SEED 117 EXERCISES INTO SUPABASE
-- ==========================================================
`;

  const escapeSql = (str: string | null | undefined) => {
    if (str === null || str === undefined) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
  };

  for (const ex of exercises) {
    sql += `
INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  ${escapeSql(ex.id)}, ${escapeSql(ex.name)}, ${escapeSql(ex.slug)}, ${escapeSql(ex.description)},
  ${escapeSql(ex.primaryMuscle)}, ${escapeSql(ex.secondaryMuscles)}, ${escapeSql(ex.bodyPart)},
  ${escapeSql(ex.equipment)}, ${escapeSql(ex.difficulty)}, ${escapeSql(ex.movementPattern)},
  ${escapeSql(ex.instructions)}, ${escapeSql(ex.setupSteps)}, ${escapeSql(ex.executionSteps)},
  ${escapeSql(ex.breathingInstructions)}, ${escapeSql(ex.tempo)}, ${escapeSql(ex.recommendedSets)},
  ${escapeSql(ex.recommendedReps)}, ${ex.recommendedRestSec}, ${escapeSql(ex.commonMistakes)},
  ${escapeSql(ex.safetyTips)}, ${escapeSql(ex.beginnerAlternative)}, ${escapeSql(ex.intermediateAlternative)},
  ${escapeSql(ex.advancedAlternative)}, ${escapeSql(ex.tags)}, ${ex.caloriesBurnPerHour}, ${ex.isCustom}
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
`;
    const videoUrl = getExerciseVideoUrl(ex.slug);
    if (videoUrl) {
      sql += `INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('media-${ex.slug}', ${escapeSql(ex.id)}, 'VIDEO', '${videoUrl}', 'KAGGLE', true) ON CONFLICT ("id") DO NOTHING;\n`;
    }
  }

  // Workouts and workout exercises
  for (const w of workouts) {
    sql += `
INSERT INTO "Workout" ("id", "name", "slug", "description", "category", "difficulty", "durationMinutes", "isTemplate", "isPublic", "tags")
VALUES (${escapeSql(w.id)}, ${escapeSql(w.name)}, ${escapeSql(w.slug)}, ${escapeSql(w.description)}, ${escapeSql(w.category)}, ${escapeSql(w.difficulty)}, ${w.durationMinutes}, ${w.isTemplate}, ${w.isPublic}, ${escapeSql(w.tags)})
ON CONFLICT ("slug") DO NOTHING;
`;
    for (const we of w.exercises) {
      sql += `INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES (${escapeSql(we.id)}, ${escapeSql(we.workoutId)}, ${escapeSql(we.exerciseId)}, ${we.orderIndex}, ${we.targetSets}, ${escapeSql(we.targetReps)}, ${we.targetRestSec}, ${escapeSql(we.tempo)}, ${escapeSql(we.notes)}) ON CONFLICT ("id") DO NOTHING;\n`;
    }
  }

  // Default accounts
  sql += `
-- ==========================================================
-- 4. SEED ADMIN & DEMO USER ACCOUNTS
-- ==========================================================
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "fitnessGoal", "experienceLevel", "xp", "level", "streakDays")
VALUES 
  ('admin-seed-id', 'admin@fitai.app', '$2a$10$tZ26fJtU0uB5XGzC07HjmeB8aU64d1vB78lG.3p8yNqmFq21oT7K6', 'Admin Master', 'ADMIN', 'muscle_building', 'advanced', 1250, 4, 12),
  ('user-demo-id', 'user@fitai.app', '$2a$10$Y1sL9mG1f1Zt4eN0z5eEkuV1c6L9iB5d4rF3mX8jA2gQ7sH9vK3p2', 'Alex Mercer', 'USER', 'muscle_building', 'intermediate', 450, 2, 5)
ON CONFLICT ("email") DO NOTHING;
`;

  const outputPath = path.join(process.cwd(), 'supabase-schema.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log(`✅ Successfully generated complete Supabase SQL script at: ${outputPath}`);
}

generateSupabaseSql()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error generating Supabase SQL:', err);
    process.exit(1);
  });
