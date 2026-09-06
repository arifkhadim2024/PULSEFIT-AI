-- ==========================================================
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

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '34c6ba28-52e8-49dc-bdc6-b7f2f80e4bd9', 'Barbell Bench Press', 'barbell-bench-press', 'The definitive upper-body horizontal pushing exercise for developing the pectoralis major, anterior deltoids, and triceps.',
  'Chest', 'Triceps, Front Deltoids, Serratus Anterior', 'Chest',
  'Barbell', 'Intermediate', 'Horizontal Push',
  'Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower the bar with control to your mid-chest, and press forcefully back up to full extension.', '["Lie flat on the bench with eyes positioned directly beneath the racked barbell.","Grip the bar slightly wider than shoulder-width with a firm, closed grip.","Retract and depress your scapulae, planting your feet firmly on the floor.","Unrack the bar and stabilize it directly over your chest with locked elbows."]', '["Inhale, brace your core, and lower the barbell in a slight arc toward your lower-mid sternum.","Maintain tucked elbows at roughly a 45-to-70-degree angle relative to your torso.","Lightly touch the chest without bouncing.","Drive your feet into the floor and press the bar upwards in a slight J-curve back over your shoulders while exhaling."]',
  'Inhale and brace deeply into your abdomen at the top before lowering; exhale past the sticking point on the press.', '3-1-1-0', '3-4',
  '6-8', 120, '[{"mistake":"Flaring elbows at 90 degrees","fix":"Tuck elbows to 45-60 degrees to prevent shoulder impingement."},{"mistake":"Bouncing bar off sternum","fix":"Control the descent with a 2-3 second eccentric and pause softly."},{"mistake":"Lifting glutes off the bench","fix":"Keep hips glued to the bench while generating leg drive."}]',
  'Always use safety pins or a spotter when lifting heavy weights. Keep wrists straight over your forearms rather than bent back.', 'Dumbbell Bench Press', 'Incline Barbell Bench Press',
  'Paused Barbell Bench Press with Chains', 'compound, chest, pushing, strength, hypertrophy, barbell', 400, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('c06cc4b9-f868-4c0d-863c-ba29d5a84306', '34c6ba28-52e8-49dc-bdc6-b7f2f80e4bd9', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a06f11b3-8088-4896-b1bb-0203fc902b29', 'Incline Dumbbell Press', 'incline-dumbbell-press', 'An exceptional compound exercise emphasizing the clavicular (upper) head of the pectoralis major and anterior deltoids with free range of motion.',
  'Chest', 'Front Deltoids, Triceps', 'Chest',
  'Dumbbell', 'Intermediate', 'Horizontal Push',
  'Set an adjustable bench to a 30-degree incline, press dumbbells up in a converging arc, and lower under control to chest level.', '["Adjust bench to a 30-45 degree incline.","Sit down with dumbbells resting upright on your thighs.","Kick the dumbbells up one at a time to shoulder level as you lean back.","Retract your shoulder blades and place feet flat on the ground."]', '["Lower dumbbells slowly until you feel a deep stretch in your upper chest.","Keep wrists stacked directly above elbows.","Press dumbbells upward in a slight converging arc without banging them together at the top."]',
  'Inhale during the lowering phase; exhale during the pressing phase.', '3-0-1-0', '3-4',
  '8-12', 90, '[{"mistake":"Bench angle too steep (>45 deg)","fix":"Keep incline between 30 and 45 degrees to target upper chest rather than front shoulders."},{"mistake":"Banging dumbbells together","fix":"Maintain continuous muscular tension at the top without clinking weights."}]',
  'Lower dumbbells smoothly to your knees before standing up when finishing the set.', 'Incline Machine Chest Press', 'Incline Barbell Bench Press',
  'Incline Dumbbell Press with 2s Pause', 'upper chest, dumbbell, compound, hypertrophy', 360, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a170499f-ca68-49be-b81e-7101d4e2c148', 'a06f11b3-8088-4896-b1bb-0203fc902b29', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'eaee4513-eaa6-4be1-800a-f9549948c3d1', 'Dumbbell Bench Press', 'dumbbell-bench-press', 'Flat bench pressing with dumbbells allowing greater range of motion, independent unilateral limb control, and deep chest stretch.',
  'Chest', 'Triceps, Front Deltoids', 'Chest',
  'Dumbbell', 'Beginner', 'Horizontal Push',
  'Lie on a flat bench holding dumbbells at chest level, press upwards until arms are extended, and lower slowly.', '["Sit on bench with dumbbells on knees, kick back and position weights at mid-chest level."]', '["Press upwards smoothly, lower until elbows reach parallel or slightly below bench level."]',
  'Inhale on the way down, exhale as you press up.', '3-0-1-0', '3-4',
  '8-12', 90, '[{"mistake":"Excessive elbow flare","fix":"Angle elbows at 45 degrees to protect shoulders."}]',
  'Do not drop dumbbells sideways; bring them back to your knees safely.', 'Push-Ups', 'Barbell Bench Press',
  'Alternating Dumbbell Bench Press', 'chest, dumbbell, hypertrophy, beginner friendly', 350, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e7ffff52-9420-4a7c-9c89-0f27503ad205', 'eaee4513-eaa6-4be1-800a-f9549948c3d1', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9140cbf1-5160-4f60-a047-d13d2c187245', 'Cable Chest Fly', 'cable-chest-fly', 'Constant tension isolation movement designed to maximize hypertrophy and peak contraction of the sternal chest fibers.',
  'Chest', 'Front Deltoids, Biceps (stabilizer)', 'Chest',
  'Cable', 'Beginner', 'Isolation',
  'Set cable pulleys to chest height, grasp handles, take a staggered step forward, and bring hands together in a wide hugging arc.', '["Position pulleys at mid/chest height, grab both handles and take one step forward into a split stance."]', '["Maintain a slight bend in your elbows.","Bring hands together in front of your chest in a hugging motion.","Squeeze the pectorals hard for 1 second, then return with control."]',
  'Inhale as arms open wide, exhale as you squeeze handles together.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Turning the fly into a press","fix":"Lock a consistent elbow angle throughout the entire movement."}]',
  'Do not overstretch shoulders past the plane of your torso.', 'Pec Deck Machine', 'Low-to-High Cable Fly',
  'Cable Fly with Cross-Over Squeeze', 'chest, isolation, cables, pump, hypertrophy', 280, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('946b3c40-5892-47ac-8086-d34cbbfbc692', '9140cbf1-5160-4f60-a047-d13d2c187245', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2bbbd169-511c-48d9-bda2-dd44800b5735', 'Push-Ups', 'push-ups', 'The fundamental calisthenic horizontal push exercise targeting chest, triceps, anterior deltoids, and core stability.',
  'Chest', 'Triceps, Front Deltoids, Abs', 'Chest',
  'Bodyweight', 'Beginner', 'Horizontal Push',
  'Place hands slightly wider than shoulder-width, maintain a rigid plank from head to heels, lower chest to floor, and push back up.', '["Start in high plank position with hands beneath shoulders, fingers spread, core braced."]', '["Lower body until chest is an inch off the floor, keep elbows at 45 degrees, press up firmly."]',
  'Inhale going down, exhale pressing up.', '2-0-1-0', '3',
  '15-25', 60, '[{"mistake":"Sagging lower back","fix":"Squeeze glutes and brace abs to maintain a straight line."}]',
  'Elevate hands on a bench or wall if wrist or shoulder discomfort occurs.', 'Incline Push-Ups on Bench', 'Diamond Push-Ups',
  'Deficit Weighted Push-Ups', 'bodyweight, home workout, chest, functional', 320, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('2456e3ee-2d52-46d7-8d5e-addc5b6ae636', '2bbbd169-511c-48d9-bda2-dd44800b5735', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '54375292-f9e7-4c64-8f6d-7a3e790aa836', 'Chest Dips', 'chest-dips', 'Powerful bodyweight compound movement emphasizing the lower pectoral fibers and triceps with forward torso lean.',
  'Chest', 'Triceps, Front Deltoids', 'Chest',
  'Bodyweight', 'Intermediate', 'Vertical Push',
  'Mount parallel bars, lean torso forward at roughly 30 degrees, flare elbows slightly outward, lower until 90 degree elbow bend, and push up.', '["Mount parallel bars, lock arms, lean chest forward and bend knees slightly."]', '["Lower down until upper arms are parallel to floor, drive through palms to return to top."]',
  'Inhale descending, exhale ascending.', '3-0-1-0', '3-4',
  '8-12', 90, '[{"mistake":"Staying completely upright","fix":"Lean forward to target chest rather than pure triceps."}]',
  'Do not dip below 90 degrees if you have a history of anterior shoulder impingement.', 'Assisted Dip Machine', 'Bodyweight Dips',
  'Weighted Chest Dips', 'chest, triceps, bodyweight, calisthenics', 380, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('96624f6e-33ca-4113-98d7-4cd140fb3c89', '54375292-f9e7-4c64-8f6d-7a3e790aa836', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3bc761a7-8883-40a3-9540-28c7b513323e', 'Pec Deck Machine', 'pec-deck-machine', 'Machine fly delivering strict chest isolation, eliminating balance demands, and providing continuous resistance.',
  'Chest', 'Front Deltoids', 'Chest',
  'Machine', 'Beginner', 'Isolation',
  'Sit against back pad, align handles with mid-chest, pull levers together until pads touch, squeeze, and return under control.', '["Adjust seat height so handles align directly with middle chest level."]', '["Bring handles together smoothly, hold contraction for 1 second, control the eccentric."]',
  'Inhale opening arms, exhale bringing pads together.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Over-extending shoulders behind torso","fix":"Set range limiters to stop arms at torso plane."}]',
  'Select a moderate load to protect the sternoclavicular joints.', 'Pec Deck Machine', 'Cable Fly',
  'Single-Arm Pec Deck Fly', 'chest, machine, beginner, isolation', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('26382e9e-3540-4e83-91de-4a6361f2b090', '3bc761a7-8883-40a3-9540-28c7b513323e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3882993e-7be9-4a3b-bef3-5700cad30d63', 'Decline Barbell Bench Press', 'decline-barbell-bench-press', 'Decline variation targeting lower pectoral muscle fibers while reducing stress on the shoulder joints.',
  'Chest', 'Triceps, Front Deltoids', 'Chest',
  'Barbell', 'Intermediate', 'Horizontal Push',
  'Secure legs in decline bench, unrack bar over lower chest, lower to sternum and press vertically.', '["Hook shins securely under pads, lie back and unrack bar."]', '["Lower bar with control to lower chest line, press up to arm lockout."]',
  'Inhale descending, exhale pressing up.', '3-0-1-0', '3-4',
  '8-10', 90, '[{"mistake":"Pressing toward head","fix":"Keep bar path over lower chest."}]',
  'Always ensure your feet are locked into the ankle rollers.', 'Decline Dumbbell Press', 'Dips',
  'Decline Barbell Press with Pause', 'lower chest, barbell, strength', 370, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('21a1ae61-5f5c-4412-9918-5a178509e2c1', '3882993e-7be9-4a3b-bef3-5700cad30d63', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9a4dda9e-633f-468e-bfa4-a4bbe28c4d5a', 'Machine Chest Press', 'machine-chest-press', 'Guided horizontal press machine offering maximum stability for safely loading chest to high fatigue.',
  'Chest', 'Triceps, Front Deltoids', 'Chest',
  'Machine', 'Beginner', 'Horizontal Push',
  'Adjust seat height so handles line up with mid-chest, press handles forward to lockout, and return slowly.', '["Sit back against pad, feet planted, adjust seat height to mid-chest."]', '["Press handles outward until arms are straight, return with a 3-second negative."]',
  'Inhale on the return, exhale pushing forward.', '3-0-1-0', '3',
  '10-12', 75, '[{"mistake":"Letting weight stack slam","fix":"Control the full eccentric range."}]',
  'Keep back flat against the pad throughout.', 'Machine Chest Press', 'Dumbbell Bench Press',
  'Drop-set Machine Chest Press', 'machine, chest, beginner, safe', 300, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b82a6991-eff3-41bc-aeac-cc498298854d', '9a4dda9e-633f-468e-bfa4-a4bbe28c4d5a', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '07305642-13c4-4e75-b828-f97f2ce84307', 'Incline Barbell Bench Press', 'incline-barbell-bench-press', 'Standard barbell exercise for developing upper chest mass and pressing strength.',
  'Chest', 'Front Deltoids, Triceps', 'Chest',
  'Barbell', 'Intermediate', 'Horizontal Push',
  'Lie on an incline bench, grip barbell shoulder-width, lower bar to upper chest under chin, and press upward.', '["Lie on 30-45 degree incline bench, grip bar with medium grip."]', '["Lower bar controlled to clavicle region, press up to full arm extension."]',
  'Inhale on descent, exhale on ascent.', '3-0-1-0', '3-4',
  '6-10', 120, '[{"mistake":"Lowering too low down torso","fix":"Touch upper chest near clavicles."}]',
  'Use safety catches on the incline rack.', 'Incline Dumbbell Press', 'Incline Barbell Press',
  'Incline Barbell Press with Chains', 'upper chest, barbell, mass builder', 380, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('8dee956f-c861-4e6b-9ec0-f23896f6330b', '07305642-13c4-4e75-b828-f97f2ce84307', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3e7a14d1-9486-408b-b5d5-43f34947e0d5', 'Smith Machine Bench Press', 'smith-machine-bench-press', 'Fixed bar path pressing that allows intense muscular focus and safe failure without a spotter.',
  'Chest', 'Triceps, Front Deltoids', 'Chest',
  'Smith Machine', 'Beginner', 'Horizontal Push',
  'Align flat bench under the Smith bar, unhook the catches, lower bar to chest, and drive up.', '["Center bench under Smith machine, set safety stops at chest level."]', '["Unhook bar by rotating wrists, lower to mid-chest, press upward smoothly."]',
  'Inhale down, exhale up.', '3-1-1-0', '3',
  '8-12', 90, '[{"mistake":"Incorrect bench alignment","fix":"Ensure bar tracks vertically directly to mid-chest."}]',
  'Always engage the safety stoppers at chest height.', 'Machine Chest Press', 'Barbell Bench Press',
  'Smith Machine Bench with 3s Pause', 'smith machine, chest, hypertrophy', 330, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('2f8d5503-8e08-41cd-a26c-aef662214430', '3e7a14d1-9486-408b-b5d5-43f34947e0d5', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'ea0e4ba5-d524-436e-9fbc-5fde341a99c8', 'Dumbbell Pullover', 'dumbbell-pullover', 'Unique movement expanding rib cage mechanics and working both the chest and lats simultaneously.',
  'Chest', 'Back, Triceps, Serratus Anterior', 'Chest',
  'Dumbbell', 'Intermediate', 'Isolation',
  'Lie across a flat bench, hold a dumbbell over chest with both hands in diamond grip, lower weight back over head, and pull back.', '["Lie perpendicular across bench supporting upper back, hips slightly dropped."]', '["Lower dumbbell backward in an arc until deep stretch in chest and lats, pull back over face."]',
  'Deep inhale as dumbbell descends, exhale pulling back.', '3-1-1-0', '3',
  '10-12', 75, '[{"mistake":"Bending elbows excessively","fix":"Keep slight, constant elbow bend."}]',
  'Do not overload weight beyond shoulder joint comfort.', 'Straight-Arm Cable Pulldown', 'Dumbbell Pullover',
  'Barbell Pullover on Incline Bench', 'chest, lats, serratus, expansion', 290, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('84b4df33-1e7d-4558-9812-9d94bc4b0972', 'ea0e4ba5-d524-436e-9fbc-5fde341a99c8', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'd454eb4f-c05d-403b-bd95-a8904c7fe41d', 'Conventional Deadlift', 'conventional-deadlift', 'The king of posterior chain compound movements, building unparalleled back, glute, hamstring, and grip power.',
  'Back', 'Glutes, Hamstrings, Traps, Forearms, Core', 'Back',
  'Barbell', 'Advanced', 'Hinge',
  'Stand with feet hip-width under bar, hinge at hips, grasp bar, brace core, and drive through the floor to stand fully erect.', '["Stand with mid-foot under the bar, shins roughly 1 inch away.","Hinge hips back and grip the bar outside knees with double overhand or hook grip.","Pull chest up, pull slack out of the bar, engage lats (\"protect armpits\"), brace core."]', '["Push floor away with legs while keeping bar tight against shins.","Extend hips and knees simultaneously to lock out standing tall.","Hinge at hips to return bar under control to the ground."]',
  'Big diaphragmatic inhale into belt at bottom, hold brace through ascent, exhale at lockout.', '2-0-1-0', '3-5',
  '3-6', 180, '[{"mistake":"Rounding lumbar spine","fix":"Maintain neutral spine and engage lats to brace torso."},{"mistake":"Bar drifting away from body","fix":"Drag bar up shins and thighs to minimize spinal moment arm."}]',
  'Never jerk the barbell from the floor; pull the tension tight before leg drive.', 'Trap Bar Deadlift', 'Romanian Deadlift',
  'Deficit Deadlift', 'deadlift, back, posterior chain, compound, strength', 500, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('fd53f6a6-d7ea-4abc-89e4-e2a43f82018e', 'd454eb4f-c05d-403b-bd95-a8904c7fe41d', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'deab73d0-ab02-4561-bd46-686f0e803a16', 'Pull-Ups', 'pull-ups', 'The premier vertical pulling calisthenics exercise for broadening the latissimus dorsi, upper back, and biceps.',
  'Back', 'Biceps, Forearms, Traps', 'Back',
  'Bodyweight', 'Intermediate', 'Vertical Pull',
  'Hang from pull-up bar with overhand grip wider than shoulders, pull chest up toward the bar until chin clears, lower to full hang.', '["Grip bar with overhand grip just outside shoulder-width, hang with arms fully extended."]', '["Depress scapulae, pull elbows down and back to ribs, touch upper chest to bar, lower with control."]',
  'Exhale pulling up, inhale lowering down.', '2-1-1-0', '3-4',
  '6-12', 90, '[{"mistake":"Kipping or swinging legs","fix":"Keep legs straight and core hollowed for strict lat recruitment."}]',
  'Control the bottom of the movement to avoid shoulder labrum stress.', 'Lat Pulldown', 'Bodyweight Pull-Ups',
  'Weighted Pull-Ups', 'pull-up, lats, back, bodyweight, calisthenics', 390, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('13f5d86c-7969-4055-9040-17559602dcfb', 'deab73d0-ab02-4561-bd46-686f0e803a16', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'de656105-0f2b-4a7c-ad8b-5790c1430faf', 'Barbell Bent-Over Row', 'barbell-bent-over-row', 'Heavy compound horizontal row targeting total back thickness, rhomboids, rear delts, and spinal erectors.',
  'Back', 'Biceps, Traps, Forearms, Lower Back', 'Back',
  'Barbell', 'Intermediate', 'Horizontal Pull',
  'Hinge at hips with torso around 45 degrees, grip bar overhand, pull bar to your lower ribcage/navel, and lower controlled.', '["Hinge hips at 45 degrees with flat back, grip bar slightly wider than shoulder-width."]', '["Drive elbows up and back, pull bar to lower abdomen, squeeze shoulder blades together, lower."]',
  'Inhale at bottom, exhale rowing up.', '2-1-1-0', '3-4',
  '8-10', 90, '[{"mistake":"Using body momentum/jerking","fix":"Keep torso stationary and pull with lats and rhomboids."}]',
  'Do not round lower back under load.', 'Chest-Supported Dumbbell Row', 'T-Bar Row',
  'Pendlay Row', 'back, row, barbell, mass, thickness', 420, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('220ab6a3-9d09-45f2-a614-23c0f5530b25', 'de656105-0f2b-4a7c-ad8b-5790c1430faf', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '03381b92-41d3-43fb-a70f-e3728e53c5e1', 'Lat Pulldown', 'lat-pulldown', 'Machine cable vertical pulling exercise allowing precise hypertrophy focus on the latissimus dorsi.',
  'Back', 'Biceps, Forearms', 'Back',
  'Cable', 'Beginner', 'Vertical Pull',
  'Sit under knee pads, grip wide bar, pull bar smoothly down to upper chest while leaning back slightly, and release slowly.', '["Lock thighs under pads, grip bar with wide overhand grip, sit tall."]', '["Drive elbows down toward your pockets, pull bar to collarbone, squeeze lats, return to full stretch."]',
  'Exhale pulling down, inhale returning up.', '2-1-1-0', '3-4',
  '10-12', 75, '[{"mistake":"Leaning back excessively into a row","fix":"Keep torso at a slight 10-15 degree lean only."}]',
  'Never pull the bar behind the neck.', 'Lat Pulldown', 'Pull-Ups',
  'Single-Arm Lat Pulldown', 'lats, back, cable, hypertrophy', 320, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('926e45fc-340c-405e-8e41-20f4166d609e', '03381b92-41d3-43fb-a70f-e3728e53c5e1', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9013c0d1-7b72-46c4-b843-e497c9ddfc64', 'Seated Cable Row', 'seated-cable-row', 'Horizontal cable row allowing constant tension across the entire middle back, rhomboids, and lower lats.',
  'Back', 'Biceps, Traps, Rear Deltoids', 'Back',
  'Cable', 'Beginner', 'Horizontal Pull',
  'Sit with feet on footplates, knees slightly bent, pull V-handle to abdomen with chest tall, and return under control.', '["Sit with upright posture, slight knee flexion, hold handle with arms extended."]', '["Pull handle into stomach, pull shoulder blades back, squeeze 1s, extend arms fully with slight stretch."]',
  'Exhale pulling in, inhale returning.', '2-1-1-1', '3',
  '10-12', 75, '[{"mistake":"Rocking back and forth from hips","fix":"Keep torso stable and focus on scapular retraction."}]',
  'Do not overstretch lower back into excessive flexion at the start.', 'Seated Cable Row', 'Single-Arm Cable Row',
  'Meadows Row', 'back, cable, row, middle back', 310, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0370a010-59cb-447b-af2b-158f5f0a485d', '9013c0d1-7b72-46c4-b843-e497c9ddfc64', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '51266845-bb6d-4567-9e40-3f5d61f9943e', 'Single-Arm Dumbbell Row', 'single-arm-dumbbell-row', 'Unilateral free weight row providing full range of motion, lat stretch, and core anti-rotation stability.',
  'Back', 'Biceps, Rear Deltoids, Forearms', 'Back',
  'Dumbbell', 'Beginner', 'Horizontal Pull',
  'Place one knee and hand on flat bench, hold dumbbell in other hand, pull elbow up toward hip, and lower fully.', '["Support body on bench with one hand and knee, spine flat, dumbbell hanging directly down."]', '["Pull dumbbell back toward hip in an arc, squeeze lat at top, lower slowly to full stretch."]',
  'Exhale rowing up, inhale lowering.', '2-1-1-0', '3',
  '10-12 / arm', 60, '[{"mistake":"Rotating torso to yank weight","fix":"Keep chest square to the bench."}]',
  'Maintain neutral spine throughout.', 'Single-Arm Dumbbell Row', 'Chest-Supported Row',
  'Kroc Row (High Rep)', 'back, dumbbell, unilateral, lats', 340, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a0d5de22-0baa-4c34-ad52-f164c20a6170', '51266845-bb6d-4567-9e40-3f5d61f9943e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '69ec24c6-61bd-49a8-9db6-231a8a52cccc', 'T-Bar Row', 't-bar-row', 'Classic heavy back thickness builder utilizing a landmine or fixed pivot T-bar platform.',
  'Back', 'Traps, Rear Delts, Biceps, Lower Back', 'Back',
  'Barbell', 'Intermediate', 'Horizontal Pull',
  'Straddle the T-bar, grip handles, maintain flat back at 45 degrees, pull weight to chest, and lower.', '["Straddle bar, hinge at hips, grip handles with flat back."]', '["Drive elbows up and back, pull weight to upper abdomen, pause and lower under control."]',
  'Exhale rowing, inhale lowering.', '2-1-1-0', '3-4',
  '8-10', 90, '[{"mistake":"Standing too upright","fix":"Stay locked in a 45-degree hinge."}]',
  'Brace core tightly to avoid lumbar strain.', 'Chest-Supported Machine Row', 'Barbell Row',
  'Chest-Supported T-Bar Row', 'back, t-bar, thickness, compound', 410, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('beed202d-c93a-4d26-879d-bc403edad2ba', '69ec24c6-61bd-49a8-9db6-231a8a52cccc', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'fc18c8a8-7840-46b7-9ac6-ff7465d6d870', 'Straight-Arm Cable Pulldown', 'straight-arm-cable-pulldown', 'Pure lat isolation movement bypassing biceps to develop width and lat engagement.',
  'Back', 'Triceps (long head), Abs, Serratus', 'Back',
  'Cable', 'Beginner', 'Isolation',
  'Stand facing high pulley with straight bar, arms nearly straight, pull bar in an arc down to thighs, and return slowly.', '["Stand facing cable, slight hip hinge, grab bar with overhand grip and slight elbow bend."]', '["Sweep bar down toward upper thighs using only lats, squeeze 1s, return back up to shoulder height."]',
  'Exhale pulling down, inhale returning up.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Bending elbows into a tricep pushdown","fix":"Keep elbow angle locked rigid."}]',
  'Keep core braced to avoid hyperextending spine.', 'Straight-Arm Cable Pulldown', 'Dumbbell Pullover',
  'Kneeling Rope Straight-Arm Pulldown', 'lats, isolation, cables, lat width', 270, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('532e942c-5fc5-49af-9512-98cc6d62924d', 'fc18c8a8-7840-46b7-9ac6-ff7465d6d870', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'c442b69f-ad78-439c-a0b4-ab6c7014fd2f', 'Chin-Ups', 'chin-ups', 'Underhand grip vertical pull heavily activating lats and biceps with superior mechanical leverage.',
  'Back', 'Biceps, Forearms', 'Back',
  'Bodyweight', 'Intermediate', 'Vertical Pull',
  'Grip bar with palms facing you shoulder-width, pull chest up until chin clears bar, lower to full dead hang.', '["Grip bar with supinated (underhand) grip shoulder-width apart."]', '["Pull up driving elbows down, touch chest to bar, lower with control."]',
  'Exhale ascending, inhale descending.', '2-0-1-0', '3',
  '6-10', 90, '[{"mistake":"Half reps without full extension","fix":"Lower all the way to full arm extension."}]',
  'Do not drop suddenly into bottom hang.', 'Underhand Lat Pulldown', 'Chin-Ups',
  'Weighted Chin-Ups', 'back, biceps, chin-up, bodyweight', 380, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('8c158467-be5a-4293-a323-3b603d648b7b', 'c442b69f-ad78-439c-a0b4-ab6c7014fd2f', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2f037155-c9eb-4786-a35c-5fc969d673eb', 'Chest-Supported Row', 'chest-supported-row', 'Incline bench dumbbell or machine row eliminating spinal loading for pure mid-back isolation.',
  'Back', 'Rear Deltoids, Rhomboids, Biceps', 'Back',
  'Dumbbell', 'Beginner', 'Horizontal Pull',
  'Lie prone on 30-degree incline bench holding dumbbells, row weights up squeezing upper back, and lower slowly.', '["Set bench to 30 degrees, lie chest-down, dumbbells hanging naturally."]', '["Row dumbbells upward driving elbows back, squeeze scapulae, lower to full stretch."]',
  'Exhale rowing, inhale lowering.', '2-1-1-1', '3',
  '10-12', 75, '[{"mistake":"Lifting chest off the pad","fix":"Keep sternum glued to the incline bench."}]',
  'Excellent option for lifters with lower back sensitivity.', 'Chest-Supported Row', 'Barbell Row',
  'Seal Row', 'back, upper back, safe for spine, hypertrophy', 310, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('19c4a3d2-2b7e-4c0a-8f30-c6373de077c3', '2f037155-c9eb-4786-a35c-5fc969d673eb', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '43fed9bd-ef1a-4897-bf9a-6fdb23782809', 'Rack Pull', 'rack-pull', 'Partial range deadlift off pins targeting upper back, traps, erectors, and lockout grip strength.',
  'Back', 'Traps, Glutes, Forearms', 'Back',
  'Barbell', 'Intermediate', 'Hinge',
  'Set pins just below knees, hinge and grip bar, drive hips forward to lockout standing tall.', '["Position bar in power rack pins at mid-shin or below knee height."]', '["Brace core, drag bar up thighs to lockout hips, lower under control."]',
  'Inhale brace at start, exhale at top.', '2-0-1-0', '3-4',
  '6-8', 150, '[{"mistake":"Hyperextending spine at top","fix":"Lock out hips without leaning backward."}]',
  'Keep bar tight against thighs throughout.', 'Romanian Deadlift', 'Rack Pull',
  'Deadlift with Deficit', 'back, traps, barbell, heavy overload', 450, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('1d178957-721e-41ea-85ff-7c8659f79037', '43fed9bd-ef1a-4897-bf9a-6fdb23782809', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '78677a3f-469b-4c33-a74e-1b8dc4899d05', 'Machine Seated Row', 'machine-seated-row', 'Pin-loaded machine row providing guided path and chest pad for focused back hypertrophy.',
  'Back', 'Biceps, Rear Deltoids', 'Back',
  'Machine', 'Beginner', 'Horizontal Pull',
  'Adjust chest pad, grip handles, pull back squeezing shoulder blades, and return under control.', '["Set seat height so handles align with mid-torso, chest against pad."]', '["Pull handles back smoothly, pause for 1 second, control the weight return."]',
  'Exhale pulling back, inhale returning.', '2-1-1-1', '3',
  '10-12', 60, '[{"mistake":"Shrugging shoulders up","fix":"Keep shoulders depressed down away from ears."}]',
  'Do not let the weight stack crash at the start.', 'Machine Seated Row', 'Seated Cable Row',
  'Single-Arm Iso-Lateral Machine Row', 'back, machine, beginner friendly', 290, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('6586df69-445a-4808-afd8-424d20beff78', '78677a3f-469b-4c33-a74e-1b8dc4899d05', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '48a209b7-d81f-45c8-aa5d-32db9d8df77d', 'Inverted Bodyweight Row', 'inverted-bodyweight-row', 'Calisthenics horizontal pull using a Smith machine bar or gymnastics rings to build back and core control.',
  'Back', 'Biceps, Rear Delts, Core', 'Back',
  'Bodyweight', 'Beginner', 'Horizontal Pull',
  'Hang under a waist-height bar with heels on floor, pull chest to bar keeping straight body line, and lower.', '["Set bar at waist height, lie underneath, grip overhand shoulder-width."]', '["Keep body straight like a plank, pull chest up to touch bar, lower under control."]',
  'Exhale pulling up, inhale going down.', '2-0-1-0', '3',
  '10-15', 60, '[{"mistake":"Sagging hips","fix":"Squeeze glutes and abs to maintain rigid straight line."}]',
  'Adjust bar height higher to decrease difficulty.', 'Inverted Row with Bent Knees', 'Feet-Elevated Inverted Row',
  'Weighted Inverted Row', 'calisthenics, back, bodyweight, posture', 300, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('390742da-9b26-4a23-bf55-0298327137bb', '48a209b7-d81f-45c8-aa5d-32db9d8df77d', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'ee84a506-0065-4a7d-a0e4-675f3e8244b2', 'Overhead Press (OHP)', 'overhead-press', 'The foundational standing barbell vertical pressing compound for building broad deltoids, upper chest, and core stability.',
  'Shoulders', 'Triceps, Upper Chest, Traps, Core', 'Shoulders',
  'Barbell', 'Intermediate', 'Vertical Push',
  'Stand tall with barbell at collarbone height, grip just outside shoulders, press bar vertically overhead locking arms out.', '["Rack bar at collarbone height, grip slightly wider than shoulders.","Unrack, take 2 steps back, feet shoulder-width, squeeze glutes and abs.","Elbows slightly forward of the bar in the front rack position."]', '["Tilt head slightly back to clear bar path, press bar vertically upward.","Once bar clears forehead, move head forward into neutral alignment (\"push head through window\").","Lock out arms overhead with shrug, lower controlled back to collarbones."]',
  'Inhale at bottom and brace core; exhale as bar clears forehead to lockout.', '3-0-1-0', '3-4',
  '6-8', 120, '[{"mistake":"Excessive lumbar arching","fix":"Squeeze glutes and pull ribs down to prevent lower back hyperextension."},{"mistake":"Pressing bar too far forward","fix":"Keep bar path directly over mid-foot."}]',
  'If you have shoulder impingement, use a neutral grip dumbbell press instead.', 'Seated Dumbbell Shoulder Press', 'Overhead Press',
  'Push Press', 'shoulders, barbell, compound, overhead, strength', 380, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('fe0f785d-7645-4302-bd5c-f88ec34ae6dc', 'ee84a506-0065-4a7d-a0e4-675f3e8244b2', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '62a85cb8-d903-49fa-8a26-5f242ab35918', 'Dumbbell Lateral Raise', 'dumbbell-lateral-raise', 'The supreme isolation exercise for targeting the lateral (side) deltoid to build wide shoulder caps.',
  'Shoulders', 'Traps, Forearms', 'Shoulders',
  'Dumbbell', 'Beginner', 'Isolation',
  'Stand with dumbbells at sides, raise arms outward to shoulder height leading with elbows, and lower slowly.', '["Stand tall with slight torso lean, hold dumbbells with neutral grip."]', '["Raise dumbbells out to sides until parallel to floor, lead with elbows, pause 1s, lower under control."]',
  'Exhale raising up, inhale lowering.', '2-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Swinging torso for momentum","fix":"Keep body still and use moderate weights with strict form."}]',
  'Do not raise weights above shoulder height to avoid impingement.', 'Seated Dumbbell Lateral Raise', 'Cable Lateral Raise',
  'Egyptian Cable Lateral Raise', 'shoulders, side delts, isolation, width', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('daf4012a-5105-472c-a42e-26ac149a93a9', '62a85cb8-d903-49fa-8a26-5f242ab35918', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '7a402d35-39da-43ff-8a3b-50bac747791a', 'Arnold Press', 'arnold-press', 'Dumbbell shoulder press incorporating wrist rotation to activate all three deltoid heads through full range.',
  'Shoulders', 'Triceps, Upper Chest', 'Shoulders',
  'Dumbbell', 'Intermediate', 'Vertical Push',
  'Hold dumbbells at chin height with palms facing in, rotate palms outward as you press overhead, and reverse upon return.', '["Sit on bench with back support, start with dumbbells at collarbones, palms facing your chest."]', '["Press overhead while rotating wrists so palms face forward at top lockout, reverse smoothly."]',
  'Exhale pressing and rotating up, inhale returning down.', '3-0-1-0', '3',
  '8-12', 90, '[{"mistake":"Rushing the rotation","fix":"Synchronize the rotation fluidly throughout the entire pressing stroke."}]',
  'Start with lighter weights to master the rotation technique.', 'Dumbbell Shoulder Press', 'Arnold Press',
  'Standing Arnold Press', 'shoulders, arnold, dumbbell, full range', 340, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ae2224dd-8426-4d23-b56d-db605d5cfc11', '7a402d35-39da-43ff-8a3b-50bac747791a', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'bec2160b-fbcf-40f4-8aaf-d6389393a521', 'Cable Lateral Raise', 'cable-lateral-raise', 'Lateral raise using low pulley cable for continuous tension at the bottom of the movement where dumbbells provide zero load.',
  'Shoulders', 'Traps', 'Shoulders',
  'Cable', 'Beginner', 'Isolation',
  'Set cable to bottom, hold handle across body, raise arm out to side to shoulder height, and lower slowly.', '["Set pulley at lowest position, stand sideways, grab handle with opposite hand behind or in front of body."]', '["Raise arm outward until parallel to floor, pause 1s at peak contraction, lower with 3s tempo."]',
  'Exhale raising, inhale lowering.', '3-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Shrugging traps to lift handle","fix":"Depress shoulder blades and isolate side deltoid."}]',
  'Keep a slight bend in elbow.', 'Dumbbell Lateral Raise', 'Cable Lateral Raise',
  'Behind-the-Back Cable Lateral Raise', 'shoulders, side delts, cables, hypertrophy', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('018034d4-bec9-49b9-bcda-f4ba3105764e', 'bec2160b-fbcf-40f4-8aaf-d6389393a521', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5f118fe5-96a7-4970-aa9b-4698c8e2422e', 'Face Pull', 'face-pull', 'Crucial postural and shoulder health exercise targeting rear deltoids, rotator cuff, and lower trapezius.',
  'Shoulders', 'Traps, Rear Deltoids, Rhomboids', 'Shoulders',
  'Cable', 'Beginner', 'Horizontal Pull',
  'Attach rope to high cable, grip with thumbs back, pull rope directly to forehead/eyes while separating hands and externally rotating.', '["Set rope at eye/forehead height, step back into split stance with arms extended."]', '["Pull rope to bridge of nose, pull knuckles backward into external rotation, squeeze rear delts, return."]',
  'Exhale pulling back, inhale extending.', '2-1-1-1', '3-4',
  '15-20', 60, '[{"mistake":"Using excessive weight and leaning back","fix":"Use light weight with crisp external rotation."}]',
  'Essential exercise for preventing shoulder impingement from heavy bench pressing.', 'Band Face Pull', 'Cable Face Pull',
  'Seated Cable Face Pull with Pause', 'posture, rear delts, rotator cuff, shoulder health', 230, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0d918d0d-ce1f-406f-a7cd-ba93780889b4', '5f118fe5-96a7-4970-aa9b-4698c8e2422e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2495a8d2-47a9-4389-9698-c151888aacd9', 'Rear Delt Dumbbell Fly', 'rear-delt-dumbbell-fly', 'Bent-over reverse fly isolating posterior deltoids and rhomboids for 3D shoulder shape.',
  'Shoulders', 'Traps, Rhomboids', 'Shoulders',
  'Dumbbell', 'Beginner', 'Isolation',
  'Hinge at hips with torso parallel to ground, raise dumbbells out to sides with slight elbow bend, and squeeze rear delts.', '["Hinge forward at hips with flat back, dumbbells hanging beneath chest."]', '["Sweep arms outward and upward like wings, squeeze rear delts at top, lower slowly."]',
  'Exhale raising arms, inhale lowering.', '2-1-1-0', '3',
  '12-15', 60, '[{"mistake":"Using lower back swing","fix":"Keep torso completely stationary."}]',
  'Keep weights modest to avoid trapping neck tension.', 'Reverse Pec Deck Machine', 'Rear Delt Dumbbell Fly',
  'Incline Bench Prone Rear Delt Fly', 'rear delts, shoulders, isolation', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('277b62cf-5749-491e-ba2d-c6df12bf9d04', '2495a8d2-47a9-4389-9698-c151888aacd9', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '6ea4c52b-46da-4fb5-b7d3-80c8d2c26377', 'Reverse Pec Deck Fly', 'reverse-pec-deck-fly', 'Machine reverse fly providing strict isolation for the posterior deltoid with constant tension.',
  'Shoulders', 'Traps, Rhomboids', 'Shoulders',
  'Machine', 'Beginner', 'Isolation',
  'Sit facing the machine pad, grip handles at shoulder level, sweep arms backward in a wide arc, and return slowly.', '["Adjust seat so handles are at shoulder level, sit chest against pad."]', '["Drive arms backward, squeeze rear deltoids, pause 1s, return with 2s negative."]',
  'Exhale opening arms, inhale returning.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Bending elbows into a row","fix":"Keep arms nearly straight throughout the arc."}]',
  'Adjust levers so your arms start just in front of your chest.', 'Reverse Pec Deck Fly', 'Cable Rear Delt Fly',
  'Single-Arm Reverse Pec Deck', 'rear delts, machine, shoulders', 230, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0f4683cb-8c62-44d2-bacd-2ef07c99d546', '6ea4c52b-46da-4fb5-b7d3-80c8d2c26377', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '613b5e3e-1c0d-4b58-b3d7-bfec86c54dfe', 'Dumbbell Front Raise', 'dumbbell-front-raise', 'Isolation exercise focusing on the anterior (front) head of the deltoid muscle.',
  'Shoulders', 'Upper Chest', 'Shoulders',
  'Dumbbell', 'Beginner', 'Isolation',
  'Stand tall with dumbbells in front of thighs, raise one or both dumbbells forward to eye level, and lower slowly.', '["Hold dumbbells in front of thighs with overhand grip, stand tall with core braced."]', '["Lift weight forward in front of you until parallel to floor, pause, lower slowly."]',
  'Exhale raising up, inhale lowering.', '2-0-1-0', '3',
  '10-12', 60, '[{"mistake":"Leaning backward to swing weight","fix":"Keep torso still; decrease weight if needed."}]',
  'Do not raise above eye level.', 'Dumbbell Front Raise', 'Barbell Front Raise',
  'Cable Front Raise with Rope', 'front delts, shoulders, dumbbell', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ead47185-7f01-4597-9b25-90c802b51d17', '613b5e3e-1c0d-4b58-b3d7-bfec86c54dfe', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '0945836e-66e9-46fa-bbf7-23fc67a968f2', 'Dumbbell Shoulder Press', 'dumbbell-shoulder-press', 'Seated or standing compound press allowing independent shoulder mobility and natural arc.',
  'Shoulders', 'Triceps, Upper Chest', 'Shoulders',
  'Dumbbell', 'Beginner', 'Vertical Push',
  'Sit on upright bench, bring dumbbells to ear height, press overhead in a slight inward arc, and lower.', '["Sit on bench with back support, dumbbells at ear height with palms facing forward."]', '["Press weights upward until arms are extended, lower with control to ear height."]',
  'Exhale pressing up, inhale lowering.', '3-0-1-0', '3-4',
  '8-12', 90, '[{"mistake":"Arching lower back off the bench","fix":"Keep core engaged and back against pad."}]',
  'Lower dumbbells to knees before standing up.', 'Machine Shoulder Press', 'Overhead Press',
  'Standing Dumbbell Shoulder Press', 'shoulders, dumbbell, compound, strength', 350, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('94f9fe2a-9e0b-471e-b6ea-adee7ecdf3fa', '0945836e-66e9-46fa-bbf7-23fc67a968f2', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '7bc8c67e-c6eb-4558-8462-4768d240ef2c', 'Barbell Upright Row', 'barbell-upright-row', 'Compound pull targeting lateral deltoids and upper trapezius.',
  'Shoulders', 'Traps, Biceps, Forearms', 'Shoulders',
  'Barbell', 'Intermediate', 'Vertical Pull',
  'Hold bar with shoulder-width grip, pull bar vertically up to mid-chest leading with elbows, and lower.', '["Stand tall holding bar at arm length with shoulder-width grip (avoid overly narrow grip)."]', '["Pull elbows up and out, raising bar to chest level, lower under control."]',
  'Exhale pulling up, inhale lowering.', '2-0-1-0', '3',
  '10-12', 75, '[{"mistake":"Using a very narrow grip","fix":"Use a wide shoulder-width grip to prevent subacromial impingement."}]',
  'Do not pull higher than mid-chest if you feel shoulder pinching.', 'Dumbbell Upright Row', 'EZ-Bar Upright Row',
  'Cable Upright Row with Wide Rope', 'shoulders, traps, upright row', 320, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e3fcaf17-2997-4897-a1c2-fcfb1835a6d1', '7bc8c67e-c6eb-4558-8462-4768d240ef2c', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '89f7d659-870e-4dce-a42c-101ebc4ed388', 'Barbell Bicep Curl', 'barbell-bicep-curl', 'The premier mass-building exercise for overall bicep brachii thickness and peak loading.',
  'Biceps', 'Forearms, Front Deltoids (stabilizer)', 'Arms',
  'Barbell', 'Beginner', 'Isolation',
  'Stand tall holding barbell underhand shoulder-width, curl bar upward toward chest while keeping elbows pinned to sides, lower slowly.', '["Stand with feet hip-width, grip barbell underhand shoulder-width, elbows by sides."]', '["Curl bar up in an arc, squeeze biceps at top, lower slowly with 3-second negative."]',
  'Exhale curling up, inhale lowering down.', '3-0-1-0', '3-4',
  '8-12', 75, '[{"mistake":"Swinging torso and thrusting hips","fix":"Pin elbows to sides and isolate the biceps."}]',
  'Use an EZ-bar if straight barbell causes wrist discomfort.', 'Dumbbell Curl', 'Barbell Bicep Curl',
  'Barbell Cheat Curl into 4s Eccentric', 'biceps, arms, barbell, mass, hypertrophy', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e0a60c49-46c7-41c8-86cf-16f914e6a85e', '89f7d659-870e-4dce-a42c-101ebc4ed388', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '946ffe89-cac2-4063-ac97-1ee398278b8e', 'Incline Dumbbell Curl', 'incline-dumbbell-curl', 'Bench curl placing the long head of the biceps under extreme stretch for maximum bicep peak development.',
  'Biceps', 'Forearms', 'Arms',
  'Dumbbell', 'Intermediate', 'Isolation',
  'Lie back on 45-60 degree incline bench, let arms hang straight down, curl dumbbells up supinating wrists at top.', '["Set bench to 45-60 degrees, sit back with arms hanging fully extended behind torso plane."]', '["Curl dumbbells upward while keeping elbows back, squeeze biceps, lower to full stretch."]',
  'Exhale curling up, inhale lowering.', '3-1-1-0', '3',
  '10-12', 60, '[{"mistake":"Moving elbows forward","fix":"Keep upper arms pointing straight down to maintain long head stretch."}]',
  'Do not bounce out of the bottom stretch position.', 'Seated Dumbbell Curl', 'Incline Dumbbell Curl',
  'Incline Hammer Curl', 'biceps, long head, stretch, hypertrophy', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('3045383a-332f-49db-a06c-9ee0271e9319', '946ffe89-cac2-4063-ac97-1ee398278b8e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'b37127c5-7124-49f4-aeef-5624328e539c', 'Preacher Curl', 'preacher-curl', 'Arm curl on preacher bench eliminating all shoulder involvement and isolating the short head of the biceps.',
  'Biceps', 'Forearms', 'Arms',
  'Barbell', 'Beginner', 'Isolation',
  'Rest upper arms flat on preacher pad, hold EZ-bar, curl bar up to vertical, and lower controlled to near full extension.', '["Adjust seat so armpits nestle into top of pad, arms flat against slope, grip EZ-bar."]', '["Curl weight up toward face, pause, lower under control stopping just before full lockout."]',
  'Exhale curling, inhale lowering.', '3-0-1-0', '3',
  '10-12', 60, '[{"mistake":"Hyperextending and snapping elbows at bottom","fix":"Stop 5 degrees before absolute joint lockout."}]',
  'Do not drop weight rapidly into the bottom pad position.', 'Dumbbell Preacher Curl', 'EZ-Bar Preacher Curl',
  'Single-Arm Cable Preacher Curl', 'biceps, preacher, isolation, strict', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('1d17ae37-7dc6-49b7-ac81-872353b0630f', 'b37127c5-7124-49f4-aeef-5624328e539c', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '7ba75311-6032-46a7-9a0e-c032e1a36fa2', 'Hammer Curl', 'hammer-curl', 'Neutral grip curl targeting the brachialis and brachioradialis for upper arm thickness and forearm strength.',
  'Biceps', 'Forearms, Brachialis', 'Arms',
  'Dumbbell', 'Beginner', 'Isolation',
  'Stand tall holding dumbbells with palms facing each other (neutral grip), curl weights up, and lower slowly.', '["Stand with dumbbells at sides, palms facing each other, core braced."]', '["Curl dumbbells upward keeping neutral grip, squeeze brachialis at top, lower controlled."]',
  'Exhale curling, inhale lowering.', '2-1-1-0', '3',
  '10-12', 60, '[{"mistake":"Rotating wrists into supination","fix":"Keep palms facing each other throughout the entire movement."}]',
  'Keep elbows tucked to torso.', 'Standing Hammer Curl', 'Cross-Body Hammer Curl',
  'Cable Rope Hammer Curl', 'biceps, brachialis, forearms, arms', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('51dd7850-e6c0-49ea-ab69-336e09da10c4', '7ba75311-6032-46a7-9a0e-c032e1a36fa2', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '1485c0b3-c145-4dc1-a535-900afa503f4b', 'Concentration Curl', 'concentration-curl', 'Classic single-arm seated curl with elbow braced against inner thigh for absolute peak isolation.',
  'Biceps', 'Forearms', 'Arms',
  'Dumbbell', 'Beginner', 'Isolation',
  'Sit on bench, brace tricep against inner thigh, curl dumbbell up to face, squeeze hard at peak, and lower.', '["Sit on bench with legs spread, brace back of upper arm against inner thigh."]', '["Curl dumbbell upward, rotate pinky outward at top, squeeze 1s, lower slowly."]',
  'Exhale curling, inhale lowering.', '2-1-1-1', '3',
  '12-15 / arm', 45, '[{"mistake":"Swinging shoulder to assist lift","fix":"Keep arm braced firmly against inner thigh."}]',
  'Focus on mind-muscle connection rather than heavy poundages.', 'Concentration Curl', 'Spider Curl',
  'Cable Concentration Curl', 'biceps, peak, isolation, dumbbell', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b516b330-6d27-46a4-9ff9-ba6004730d12', '1485c0b3-c145-4dc1-a535-900afa503f4b', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '04384fb4-54f0-4eef-af18-4270f818c051', 'Spider Curl', 'spider-curl', 'Chest-supported prone incline curl placing maximum tension at the top shortened position of the biceps.',
  'Biceps', 'Forearms', 'Arms',
  'Barbell', 'Intermediate', 'Isolation',
  'Lie chest-down on 45-degree incline bench with arms hanging vertically forward, curl barbell up toward face.', '["Lie chest-down on incline bench, arms hanging straight down in front of torso with EZ-bar."]', '["Curl bar upward, squeeze biceps at top contraction, lower with control."]',
  'Exhale curling, inhale lowering.', '2-1-1-1', '3',
  '10-12', 60, '[{"mistake":"Pulling elbows backward","fix":"Keep upper arms perpendicular to floor."}]',
  'Eliminates any possibility of cheating or momentum.', 'Preacher Curl', 'Spider Curl',
  'Single-Arm Dumbbell Spider Curl', 'biceps, peak contraction, strict', 230, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b7690506-1921-4b96-87b0-d38bc5ce898c', '04384fb4-54f0-4eef-af18-4270f818c051', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9b648e8b-c7fd-49d2-86e5-64fd4c78c5b9', 'Cable Bicep Curl', 'cable-bicep-curl', 'Cable curl providing continuous resistance throughout both the stretched and contracted positions.',
  'Biceps', 'Forearms', 'Arms',
  'Cable', 'Beginner', 'Isolation',
  'Attach straight bar to low pulley, stand tall, curl bar up to collarbones, and lower slowly.', '["Stand facing low cable pulley holding bar with underhand grip."]', '["Curl bar upward, squeeze biceps at top, resist cable pull on the eccentric."]',
  'Exhale curling, inhale returning.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Leaning backward","fix":"Keep torso upright and stable."}]',
  'Smooth consistent movement without jerky starts.', 'Cable Bicep Curl', 'Behind-the-Back Cable Curl',
  'High Cable Bicep Curl', 'biceps, cable, constant tension', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('44dfd911-d31a-4541-b58b-c322954f966b', '9b648e8b-c7fd-49d2-86e5-64fd4c78c5b9', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'c5aa457c-8b8b-43ef-b8b8-ce7c49abf35f', 'EZ-Bar Bicep Curl', 'ez-bar-bicep-curl', 'Curling with an ergonomic undulating bar that reduces wrist and forearm strain.',
  'Biceps', 'Forearms', 'Arms',
  'Barbell', 'Beginner', 'Isolation',
  'Grip EZ-bar on the angled grooves, stand upright, curl bar to shoulder height, and lower slowly.', '["Grip EZ-bar on comfortable inner or outer angled knurling."]', '["Curl bar upward without moving elbows forward, squeeze biceps, lower under control."]',
  'Exhale up, inhale down.', '3-0-1-0', '3-4',
  '8-12', 75, '[{"mistake":"Bouncing bar off thighs","fix":"Pause slightly at bottom before initiating next rep."}]',
  'Optimal choice if straight bar causes inner wrist irritation.', 'Dumbbell Curl', 'EZ-Bar Bicep Curl',
  '21s EZ-Bar Curl Protocol', 'biceps, ez-bar, joint friendly', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('85c9767f-7286-404a-8167-359874cf9871', 'c5aa457c-8b8b-43ef-b8b8-ce7c49abf35f', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '49b776d9-8977-4ff7-9890-c2e7108e3724', 'Dumbbell Alternating Curl', 'dumbbell-alternating-curl', 'Classic free-standing curl allowing individual limb focus and dynamic wrist supination.',
  'Biceps', 'Forearms', 'Arms',
  'Dumbbell', 'Beginner', 'Isolation',
  'Stand tall with dumbbells at sides, curl one arm up while rotating palm upward, lower, and alternate sides.', '["Stand tall holding dumbbells with neutral palms."]', '["Curl one dumbbell up, turning palm toward ceiling, squeeze bicep, lower, repeat other side."]',
  'Exhale curling up, inhale lowering.', '2-0-1-0', '3',
  '10-12 / arm', 60, '[{"mistake":"Swinging back and forth","fix":"Brace core and stay upright."}]',
  'Keep neck relaxed and shoulders pulled back.', 'Seated Alternating Curl', 'Standing Alternating Curl',
  'Zottman Curl', 'biceps, dumbbell, alternating', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a96175ad-3c5d-4942-acc6-26b78782949d', '49b776d9-8977-4ff7-9890-c2e7108e3724', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9ce4e734-947f-4394-bb34-7efe16220708', 'Triceps Rope Pushdown', 'triceps-rope-pushdown', 'The premier triceps isolation movement allowing full extension and lateral head separation at the lockout.',
  'Triceps', 'Forearms', 'Arms',
  'Cable', 'Beginner', 'Isolation',
  'Attach rope to high pulley, pin elbows to ribs, push rope down and spread ends apart at full elbow extension.', '["Stand facing cable, slight torso hinge, elbows pinned tightly by your ribcage, hold rope handles."]', '["Push rope down by extending elbows, flare ends outward at bottom, squeeze triceps 1s, return slowly."]',
  'Exhale pushing down, inhale returning up.', '2-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Elbows drifting forward and back","fix":"Keep elbows fixed in place as a hinge."}]',
  'Do not let shoulders roll forward into the pushdown.', 'Straight Bar Pushdown', 'Rope Pushdown',
  'Single-Arm Cable Triceps Kickback', 'triceps, cable, arms, pump, isolation', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('cb9f8050-5977-4c27-ab25-aeb08f98e098', '9ce4e734-947f-4394-bb34-7efe16220708', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '0de7e6e6-41bf-440c-8895-11018d46a526', 'Skull Crushers (Lying Triceps Extension)', 'skull-crushers', 'Mass-building triceps exercise placing intense loaded stretch on the long and medial heads of the triceps.',
  'Triceps', 'Forearms', 'Arms',
  'Barbell', 'Intermediate', 'Isolation',
  'Lie on flat bench with EZ-bar extended above chest, bend elbows to lower bar toward forehead/crown, and extend back up.', '["Lie flat on bench holding EZ-bar over chest with narrow overhand grip, arms angled slightly back."]', '["Bend at elbows lowering bar toward hairline, keep upper arms steady, extend elbows back to top."]',
  'Inhale lowering bar, exhale pressing up.', '3-0-1-0', '3-4',
  '8-12', 90, '[{"mistake":"Flaring elbows wide sideways","fix":"Keep elbows tucked shoulder-width apart."}]',
  'Lower the bar under strict control; do not bounce near the forehead.', 'Dumbbell Skull Crushers', 'EZ-Bar Skull Crushers',
  'Incline Bench Skull Crushers', 'triceps, mass, ez-bar, arms', 280, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('1799a78a-3b9e-4641-96a8-694981167075', '0de7e6e6-41bf-440c-8895-11018d46a526', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3a3e6223-3ea9-4b2a-9ce4-74f9aa441358', 'Close-Grip Bench Press', 'close-grip-bench-press', 'Heavy compound horizontal press prioritizing triceps power and lockout strength with shoulder-width grip.',
  'Triceps', 'Chest, Front Deltoids', 'Arms',
  'Barbell', 'Intermediate', 'Horizontal Push',
  'Lie on flat bench, grip barbell at shoulder-width, lower bar to lower sternum keeping elbows tucked, and press to lockout.', '["Lie on bench, grip bar with hands directly in line with shoulders (approx. 14-16 inches apart)."]', '["Lower bar to lower chest while keeping elbows tucked close to ribs, press upward forcefully."]',
  'Inhale on descent, exhale on press.', '3-0-1-0', '3-4',
  '6-10', 120, '[{"mistake":"Grip too narrow (<8 inches)","fix":"Keep hands shoulder-width to avoid severe wrist and elbow strain."}]',
  'Use safety pins or a spotter on heavy sets.', 'Close-Grip Push-Ups', 'Close-Grip Bench Press',
  'Board Press Close-Grip', 'triceps, compound, barbell, heavy', 360, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('824b7148-0af4-4e8e-ad76-42216cba58d0', '3a3e6223-3ea9-4b2a-9ce4-74f9aa441358', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3e520e19-3462-46ab-b560-0b2fb8086fc6', 'Overhead Triceps Extension', 'overhead-triceps-extension', 'Overhead extension placing the triceps long head under maximum stretch for complete arm development.',
  'Triceps', 'Forearms', 'Arms',
  'Dumbbell', 'Beginner', 'Isolation',
  'Sit or stand holding a dumbbell overhead with both hands, lower dumbbell behind head, and extend arms overhead.', '["Sit tall with core engaged, hold dumbbell overhead with both hands in diamond grip."]', '["Lower dumbbell behind neck by bending elbows, feel deep long-head stretch, extend arms to top."]',
  'Inhale lowering behind head, exhale extending up.', '3-1-1-0', '3',
  '10-12', 75, '[{"mistake":"Arching lower back","fix":"Brace abs and squeeze glutes to maintain upright spine."}]',
  'Keep elbows pointed forward rather than excessively flared.', 'Overhead Cable Triceps Extension', 'Overhead Dumbbell Extension',
  'Single-Arm Overhead Dumbbell Extension', 'triceps, long head, arms, stretch', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('08cf667e-8439-44d3-8c7a-2561b520a0e7', '3e520e19-3462-46ab-b560-0b2fb8086fc6', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '87847331-73cb-4092-9ed5-b107b784f34a', 'Triceps Dips (Parallel Bar)', 'triceps-dips', 'Upright parallel bar dip focusing on triceps lockout strength and overload.',
  'Triceps', 'Chest, Front Deltoids', 'Arms',
  'Bodyweight', 'Intermediate', 'Vertical Push',
  'Mount bars, keep torso upright, lower until elbows reach 90 degrees, and push back up to lockout.', '["Mount parallel bars, lock arms, keep torso strictly upright with legs straight below."]', '["Lower down keeping elbows tucked close to sides, press through palms to lockout."]',
  'Inhale down, exhale up.', '3-0-1-0', '3',
  '8-12', 90, '[{"mistake":"Leaning forward excessively","fix":"Stay vertical to isolate triceps over chest."}]',
  'Do not dip deeper than 90 degrees if you have shoulder tightness.', 'Bench Dips', 'Triceps Dips',
  'Weighted Triceps Dips', 'triceps, calisthenics, bodyweight, strength', 360, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('95ae2016-09df-4bbe-9fd1-ad956bba5b26', '87847331-73cb-4092-9ed5-b107b784f34a', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2efd9177-f53f-48ac-bd19-bbce8f73b615', 'Straight-Bar Triceps Pushdown', 'straight-bar-triceps-pushdown', 'Classic cable pushdown utilizing a solid bar to allow maximum loading on the medial and lateral heads.',
  'Triceps', 'Forearms', 'Arms',
  'Cable', 'Beginner', 'Isolation',
  'Grip straight or V-bar on high pulley with overhand grip, push bar down to thighs, and return to chest height.', '["Stand facing cable with slight forward lean, grip bar overhand, elbows tucked to ribs."]', '["Push bar down to touch thighs, lock elbows with control, return to chest level."]',
  'Exhale pushing down, inhale returning.', '2-0-1-0', '3',
  '10-12', 60, '[{"mistake":"Using bodyweight to lean over bar","fix":"Maintain posture and isolate triceps."}]',
  'Do not lock elbows violently.', 'V-Bar Pushdown', 'Straight-Bar Pushdown',
  'Reverse-Grip Triceps Pushdown', 'triceps, cable, arms', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('391dfc69-736e-4123-8475-9800b227b23b', '2efd9177-f53f-48ac-bd19-bbce8f73b615', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5b179b6b-ebcb-42cf-91c0-372a5dfed7fd', 'Cable Triceps Kickback', 'cable-triceps-kickback', 'Single-arm cable kickback providing continuous tension at peak triceps contraction.',
  'Triceps', 'Forearms', 'Arms',
  'Cable', 'Beginner', 'Isolation',
  'Set cable to mid height without attachment, hinge at hips, hold cable rubber stopper, extend arm straight back.', '["Hinge forward at 45 degrees, elbow tucked high against torso, hold cable end."]', '["Extend arm backward until completely straight, squeeze triceps for 1s, return to 90 degrees."]',
  'Exhale extending arm, inhale returning.', '2-1-1-1', '3',
  '12-15 / arm', 45, '[{"mistake":"Dropping elbow down","fix":"Keep upper arm parallel to torso throughout."}]',
  'Use light resistance to ensure complete terminal extension.', 'Dumbbell Kickback', 'Cable Kickback',
  'Dual Cable Kickback', 'triceps, isolation, cable, peak', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('35061309-f365-4405-8202-6d248c7beb58', '5b179b6b-ebcb-42cf-91c0-372a5dfed7fd', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'db735f7f-594e-455d-abad-17490221e425', 'Diamond Push-Ups', 'diamond-push-ups', 'Bodyweight push-up variation with hands touching in a diamond shape for extreme triceps emphasis.',
  'Triceps', 'Chest, Front Deltoids, Core', 'Arms',
  'Bodyweight', 'Intermediate', 'Horizontal Push',
  'Place thumbs and index fingers together beneath chest, lower body until chest touches hands, and press back up.', '["High plank position with index fingers and thumbs forming a diamond directly under sternum."]', '["Lower chest to touch diamond, keep elbows tracking close to torso, press up to lockout."]',
  'Inhale lowering, exhale pressing.', '2-0-1-0', '3',
  '10-20', 60, '[{"mistake":"Sagging hips","fix":"Keep core tight in a rigid plank."}]',
  'If wrists ache, slightly separate hands.', 'Incline Diamond Push-Ups', 'Diamond Push-Ups',
  'Feet-Elevated Diamond Push-Ups', 'triceps, bodyweight, calisthenics', 310, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('990dc41b-7c9b-4232-b660-a4aafb32fdcb', 'db735f7f-594e-455d-abad-17490221e425', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'c75f62eb-daef-4391-a337-092138e51986', 'Barbell Back Squat', 'barbell-back-squat', 'The premier lower body compound movement for developing massive quadriceps, glutes, core stability, and overall athletic power.',
  'Quadriceps', 'Glutes, Hamstrings, Adductors, Lower Back, Core', 'Legs',
  'Barbell', 'Intermediate', 'Squat',
  'Rest barbell across upper traps, step back, squat down until hips descend below knees (parallel), and drive up through mid-foot.', '["Step under bar, set bar across upper traps (high bar) or rear delts (low bar).","Unrack, take two steps back, establish shoulder-width stance with toes flared 15-30 degrees.","Take deep breath, brace core 360 degrees, pull bar firmly into back."]', '["Initiate by breaking at hips and knees simultaneously.","Descend under control while pushing knees out in line with toes.","Hit parallel or deeper with upright torso, drive through whole foot to stand tall."]',
  'Inhale deep into abdomen at top, hold brace during descent and turnaround, exhale past sticking point.', '3-1-1-0', '4-5',
  '5-8', 150, '[{"mistake":"Knees caving inward (valgus)","fix":"Push knees outward in line with toes throughout the squat."},{"mistake":"Heels lifting off floor","fix":"Keep weight centered over mid-foot and improve ankle dorsiflexion."}]',
  'Always set safety pins in power rack at just below your bottom depth.', 'Goblet Squat', 'Barbell Back Squat',
  'Paused Back Squat (3s pause)', 'squat, quads, legs, compound, strength, power', 480, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('76bfabe2-26f8-4f0d-9ad5-26d67c8d2acf', 'c75f62eb-daef-4391-a337-092138e51986', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '344f9910-e82c-4878-9fe1-406ccd812d7b', 'Leg Press', 'leg-press', 'Heavy machine compound press allowing massive quadriceps overload without spinal loading.',
  'Quadriceps', 'Glutes, Adductors, Hamstrings', 'Legs',
  'Machine', 'Beginner', 'Squat',
  'Sit in 45-degree leg press sled, place feet shoulder-width on platform, unlock safety handles, lower sled to 90 degrees, press up.', '["Sit back firmly in seat with lower back flat against pad, feet shoulder-width on footplate."]', '["Lower sled under control until knees reach 90 degrees, press through mid-foot, do not lock knees violently."]',
  'Inhale lowering platform, exhale pressing up.', '3-0-1-0', '3-4',
  '10-15', 90, '[{"mistake":"Lower back peeling off seat pad (butt wink)","fix":"Adjust seat angle or reduce depth slightly to keep pelvis locked."},{"mistake":"Locking knees out aggressively","fix":"Stop just short of bone-on-bone lockout to protect knees."}]',
  'Keep safety stoppers set at proper height.', 'Leg Press', 'Hack Squat',
  'Single-Leg 45-Degree Leg Press', 'quads, legs, machine, hypertrophy', 400, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('13fe170d-9276-42e5-81ab-6e59d927224b', '344f9910-e82c-4878-9fe1-406ccd812d7b', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'ff1b97aa-8f55-40dc-be8c-adba2264032c', 'Bulgarian Split Squat', 'bulgarian-split-squat', 'The most effective unilateral quad and glute hypertrophy exercise, correcting strength imbalances and building stability.',
  'Quadriceps', 'Glutes, Hamstrings, Adductors, Calves', 'Legs',
  'Dumbbell', 'Intermediate', 'Lunge',
  'Place rear foot on bench behind you, hold dumbbells at sides, descend until front thigh is parallel to ground, and press up.', '["Place laces of rear foot on bench roughly 2-3 feet behind front foot, torso upright or slightly angled."]', '["Lower hips down and back until rear knee nearly touches floor, drive through front heel to return."]',
  'Inhale descending, exhale ascending.', '3-1-1-0', '3',
  '8-12 / leg', 75, '[{"mistake":"Front foot too close or far","fix":"Front shin should be relatively vertical at the bottom."}]',
  'Hold on to a support rack for balance when first learning.', 'Bodyweight Static Lunge', 'Bulgarian Split Squat with Dumbbells',
  'Deficit Bulgarian Split Squat with Barbell', 'quads, glutes, unilateral, legs', 420, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e71ae44a-fa46-4bdb-a52d-9fe6b4d14411', 'ff1b97aa-8f55-40dc-be8c-adba2264032c', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '8dc8e16d-ab0e-475c-9a3e-57bdeba87499', 'Hack Squat', 'hack-squat', 'Angled machine squat that stabilizes torso completely, allowing pure knee flexion and quad isolation.',
  'Quadriceps', 'Glutes', 'Legs',
  'Machine', 'Intermediate', 'Squat',
  'Step into hack squat machine with shoulders under pads, unlock safety catches, squat down to full depth, and press up.', '["Back flat against backrest, shoulders under pads, feet mid-platform shoulder-width."]', '["Descend smoothly pushing knees forward, hit full depth, drive through feet to return to top."]',
  'Inhale down, exhale up.', '3-1-1-0', '3-4',
  '8-12', 120, '[{"mistake":"Lifting heels off footplate","fix":"Place feet slightly higher on platform if ankle mobility is limited."}]',
  'Set machine safety catches at appropriate bottom depth.', 'Leg Press', 'Hack Squat',
  'Hack Squat with 1.5 Rep Protocol', 'quads, machine, legs, mass', 410, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('49185777-f62a-4482-9c7f-ec2234d46fab', '8dc8e16d-ab0e-475c-9a3e-57bdeba87499', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '1254ac1d-d0a6-410a-8294-db6c76b40320', 'Leg Extension', 'leg-extension', 'Strict open-chain quadriceps isolation exercise emphasizing the rectus femoris at full knee extension.',
  'Quadriceps', 'None (pure isolation)', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Sit in machine with shin pad against lower shins, extend legs upward until straight, squeeze quads for 1s, lower slowly.', '["Adjust back pad so knees align with machine pivot axis, shin pad resting just above ankles."]', '["Extend legs upward smoothly, lock out with a 1-second quad squeeze, lower with a 3-second negative."]',
  'Exhale extending up, inhale lowering.', '3-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Kicking weight up with momentum","fix":"Use smooth controlled contraction."}]',
  'Ensure knee joint lines up exactly with machine axis.', 'Leg Extension', 'Single-Leg Extension',
  'Leg Extension Drop Set with 2s Peak Hold', 'quads, isolation, machine, pump', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('c8ea256e-f021-428b-bdf0-2429f1cfa3e2', '1254ac1d-d0a6-410a-8294-db6c76b40320', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '50817e9f-aae0-4da8-a530-e2c941fc4623', 'Front Squat', 'front-squat', 'Barbell squat with bar held across anterior deltoids in front rack, requiring upright torso and heavy quad emphasis.',
  'Quadriceps', 'Glutes, Upper Back, Core', 'Legs',
  'Barbell', 'Advanced', 'Squat',
  'Hold barbell in front rack position across shoulders with high elbows, squat down between knees, and drive straight up.', '["Rest bar in groove of front delts, fingers hooked lightly under bar, elbows held high parallel to floor."]', '["Squat straight down maintaining high elbows and vertical spine, hit depth, drive up through mid-foot."]',
  'Inhale deep into belly before descent, hold brace, exhale on ascent.', '3-1-1-0', '3-4',
  '6-8', 120, '[{"mistake":"Dropping elbows down","fix":"Keep elbows high to prevent bar from rolling forward off shoulders."}]',
  'Cross-arm grip can be used if wrist flexibility is limited.', 'Goblet Squat', 'Front Squat',
  'Zercher Squat', 'quads, front squat, barbell, core, posture', 450, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('2e93624f-6f7b-4dbc-a9f6-0ddde15fbc46', '50817e9f-aae0-4da8-a530-e2c941fc4623', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'add3de21-6e6d-44ff-b077-ce9ccb03afeb', 'Goblet Squat', 'goblet-squat', 'The best fundamental squat learning tool, holding dumbbell/kettlebell at chest level to promote perfect mechanics.',
  'Quadriceps', 'Glutes, Core', 'Legs',
  'Dumbbell', 'Beginner', 'Squat',
  'Hold dumbbell vertically against chest with both hands under top bell, squat down between hips, and stand up.', '["Stand with feet shoulder-width, hold dumbbell vertically touching sternum with both hands."]', '["Squat down tracking knees over toes, elbows slide inside knees at bottom, stand up tall."]',
  'Inhale down, exhale up.', '3-1-1-0', '3',
  '10-15', 60, '[{"mistake":"Holding weight too far from chest","fix":"Keep weight glued to sternum."}]',
  'Outstanding for beginners to build hip and ankle mobility.', 'Bodyweight Squat', 'Goblet Squat',
  'Barbell Front Squat', 'quads, beginner, mobility, dumbbell', 340, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('d03175ed-562f-4656-af0b-748849a5a537', 'add3de21-6e6d-44ff-b077-ce9ccb03afeb', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '38f35355-16f4-4cfc-ba12-b208ccfeb602', 'Walking Lunges', 'walking-lunges', 'Dynamic unilateral movement developing quads, glutes, balance, and functional conditioning.',
  'Quadriceps', 'Glutes, Hamstrings, Calves, Core', 'Legs',
  'Dumbbell', 'Beginner', 'Lunge',
  'Hold dumbbells at sides, step forward into a lunge until back knee grazes floor, drive forward into next step.', '["Stand tall holding dumbbells, open walking path ahead."]', '["Step forward, lower rear knee toward floor, push through front foot directly into next stride."]',
  'Breathe rhythmically with each step.', '2-0-1-0', '3',
  '10-12 steps / leg', 75, '[{"mistake":"Short choppy steps that cause heel lift","fix":"Take medium strides and plant full front foot."}]',
  'Do not let front knee collapse inward.', 'Bodyweight Walking Lunges', 'Dumbbell Walking Lunges',
  'Barbell Walking Lunges', 'legs, lunges, quads, glutes, dynamic', 400, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e36c2df3-d64f-41cd-b533-7a42ea27f52b', '38f35355-16f4-4cfc-ba12-b208ccfeb602', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'c5021d64-3dc9-49e3-a5b7-6e3e19d06688', 'Sissy Squat', 'sissy-squat', 'Advanced quad isolation exercise maximizing knee flexion and loaded stretch on the rectus femoris.',
  'Quadriceps', 'Core, Hip Flexors', 'Legs',
  'Bodyweight', 'Advanced', 'Squat',
  'Lock shins into sissy squat bench, lean torso backward as knees bend forward, and return to standing.', '["Lock feet and calves into sissy squat bench or hold a support pole."]', '["Lean back keeping straight line from knees to head, descend into deep knee flexion, push back up with quads."]',
  'Inhale descending, exhale pressing up.', '3-1-1-0', '3',
  '10-12', 60, '[{"mistake":"Bending at hips instead of knees","fix":"Keep hips fully extended throughout."}]',
  'Do not perform if you have pre-existing patellar tendonitis.', 'Leg Extension', 'Bodyweight Sissy Squat',
  'Weighted Sissy Squat with Plate', 'quads, isolation, rectus femoris, calisthenics', 320, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a2924593-4828-4199-bad5-5ef4481e00dc', 'c5021d64-3dc9-49e3-a5b7-6e3e19d06688', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'f1d34b0b-6431-4813-a1c8-078ed428f1c8', 'Step-Up', 'step-up', 'Unilateral leg exercise targeting quads and gluteus maximus with minimal lower back shear.',
  'Quadriceps', 'Glutes, Hamstrings, Calves', 'Legs',
  'Dumbbell', 'Beginner', 'Lunge',
  'Place one foot on sturdy box/bench, drive through front leg to stand on box, and lower slowly.', '["Stand facing knee-height box holding dumbbells at sides."]', '["Step front foot firmly on box, drive through mid-foot to stand up, lower under control with front leg."]',
  'Exhale stepping up, inhale lowering.', '2-0-1-0', '3',
  '10-12 / leg', 60, '[{"mistake":"Pushing off back foot with a bounce","fix":"Make the elevated lead leg do 90% of the work."}]',
  'Use a stable non-slip plyo box or bench.', 'Bodyweight Step-Up', 'Dumbbell Step-Up',
  'Barbell Step-Up on High Box', 'legs, quads, glutes, unilateral', 350, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('2e7e1f07-c9ac-4b48-ad20-548540b470ee', 'f1d34b0b-6431-4813-a1c8-078ed428f1c8', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5096b5a1-8e03-4cfa-9a4d-fa1af5581850', 'Romanian Deadlift (RDL)', 'romanian-deadlift', 'The golden standard hip-hinge exercise for developing explosive hamstrings, glutes, and lower back resilience.',
  'Hamstrings', 'Glutes, Lower Back, Forearms, Core', 'Legs',
  'Barbell', 'Intermediate', 'Hinge',
  'Hold barbell at hip height, unlock knees slightly, push hips backward until deep hamstring stretch, and drive hips forward.', '["Stand with feet hip-width apart holding barbell with overhand grip.","Soften knees slightly (15 degree bend) and lock that knee angle in place.","Brace core, pull shoulder blades down, keep bar in contact with thighs."]', '["Push your hips backward as if touching a wall behind you.","Slide the bar down your thighs until bar reaches mid-shin and hamstrings are fully stretched.","Maintain neutral spine, drive hips forward through glutes and hamstrings to return to standing."]',
  'Inhale and brace core at the top, hold through descent, exhale as you extend hips to lockout.', '3-1-1-0', '3-4',
  '8-10', 120, '[{"mistake":"Squatting down instead of hinging hips back","fix":"Keep knees soft but stationary while sending pelvis backward."},{"mistake":"Rounding lower back to reach lower","fix":"Stop descending when your hips can no longer travel backward."}]',
  'Keep the barbell glued to your legs throughout the descent to protect the lumbar spine.', 'Dumbbell Romanian Deadlift', 'Barbell Romanian Deadlift',
  'Single-Leg Romanian Deadlift', 'hamstrings, hinge, posterior chain, rdl, glutes', 420, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('9c95f8cf-ec9e-46c4-91fb-466b0089611d', '5096b5a1-8e03-4cfa-9a4d-fa1af5581850', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'b7bdb15f-361f-4951-82f5-6d794f0963e6', 'Seated Leg Curl', 'seated-leg-curl', 'Machine knee flexion exercise training hamstrings at longer muscle lengths (hip flexed) for superior hypertrophy.',
  'Hamstrings', 'Calves (Gastrocnemius)', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Sit in machine with thigh pad clamped tight, curl pad down under seat, hold 1s squeeze, and return with control.', '["Adjust backrest so knee aligns with pivot point, lock thigh pad firmly down over quadriceps."]', '["Curl pad down and backward under seat, squeeze hamstrings hard for 1 second, resist weight for 3 seconds on return."]',
  'Exhale curling down, inhale returning up.', '3-1-1-1', '3-4',
  '10-15', 60, '[{"mistake":"Loose thigh pad allowing hips to rise","fix":"Clamp thigh pad tightly to isolate hamstrings."}]',
  'Do not allow the weight to snap back at the top stretch.', 'Seated Leg Curl', 'Lying Leg Curl',
  'Single-Leg Seated Leg Curl with 2s Squeeze', 'hamstrings, machine, isolation, knee flexion', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('7707f6ea-3b79-4864-84cf-64e2b967645d', 'b7bdb15f-361f-4951-82f5-6d794f0963e6', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '4bfb9392-0f9b-4707-8efe-a1e4a62838db', 'Lying Leg Curl', 'lying-leg-curl', 'Prone machine curl isolating the knee flexion function of the hamstrings across both heads.',
  'Hamstrings', 'Calves', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Lie face down with roller pad behind ankles, curl pad up toward glutes, squeeze, and lower slowly.', '["Lie prone on bench, knees just off edge of pad, roller resting against Achilles tendons."]', '["Curl legs upward toward buttocks, squeeze hamstrings, lower with 3s tempo."]',
  'Exhale curling, inhale lowering.', '3-0-1-1', '3',
  '10-12', 60, '[{"mistake":"Hips lifting off the bench during curl","fix":"Keep hips pressed firmly into pad."}]',
  'Keep toes pointed forward or slightly dorsiflexed.', 'Lying Leg Curl', 'Seated Leg Curl',
  'Nordic Hamstring Curl', 'hamstrings, machine, prone, isolation', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ac3fe12f-e31a-4f6a-83a1-358e2dea403a', '4bfb9392-0f9b-4707-8efe-a1e4a62838db', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '6240751c-c259-4aef-bb0a-d3af939059ed', 'Nordic Hamstring Curl', 'nordic-hamstring-curl', 'The premier eccentric bodyweight hamstring builder, proven to dramatically reduce hamstring strain injuries.',
  'Hamstrings', 'Glutes, Calves, Core', 'Legs',
  'Bodyweight', 'Advanced', 'Isolation',
  'Kneel with ankles anchored securely, lower torso forward under strict hamstring control as far as possible, catch with hands, and push back up.', '["Kneel on padded surface with ankles locked down under a heavy barbell or partner holding heels."]', '["Keep straight line from knees to shoulders, lower body forward resisting gravity with hamstrings, push off floor lightly to return."]',
  'Inhale descending, exhale returning.', '4-0-1-0', '3',
  '4-8', 90, '[{"mistake":"Bending at hips (piking)","fix":"Maintain full hip extension throughout the fall."}]',
  'Use a resistance band around chest to assist if full range is too difficult.', 'Swiss Ball Hamstring Curl', 'Nordic Hamstring Curl with Band Assist',
  'Bodyweight Nordic Hamstring Curl', 'hamstrings, eccentric, bulletproof, athletic', 340, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('81a2fcf8-23d7-442b-8fc9-4afa7dfd49e0', '6240751c-c259-4aef-bb0a-d3af939059ed', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'aefdc69e-1eeb-42f3-ba82-3cd08d06214b', 'Dumbbell Romanian Deadlift', 'dumbbell-romanian-deadlift', 'Free-weight hip hinge with dumbbells allowing personalized grip angle and natural tracking along sides of legs.',
  'Hamstrings', 'Glutes, Lower Back', 'Legs',
  'Dumbbell', 'Beginner', 'Hinge',
  'Hold dumbbells in front of thighs, hinge hips back with soft knees, lower weights to mid-shins, and drive hips forward.', '["Stand tall holding dumbbells, feet hip-width, knees slightly bent."]', '["Push hips back, lower dumbbells down front/sides of shins, stretch hamstrings, return upright."]',
  'Inhale down, exhale up.', '3-1-1-0', '3',
  '10-12', 75, '[{"mistake":"Letting dumbbells swing away from body","fix":"Keep dumbbells brushing along legs."}]',
  'Keep spine flat and head neutral.', 'Dumbbell Romanian Deadlift', 'Barbell Romanian Deadlift',
  'Single-Leg Dumbbell RDL', 'hamstrings, dumbbells, hinge, beginner', 350, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('10f9e639-b61a-4416-8643-711b0c6f1cc5', 'aefdc69e-1eeb-42f3-ba82-3cd08d06214b', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '0548aaae-d47d-410e-95fd-c03bff0d8ead', 'Stiff-Leg Deadlift', 'stiff-leg-deadlift', 'Deadlift variation with elevated hips and minimal knee bend for intense hamstring stretch starting from floor or deficit.',
  'Hamstrings', 'Glutes, Lower Back', 'Legs',
  'Barbell', 'Advanced', 'Hinge',
  'Stand over bar with nearly straight knees, hinge down to grip bar, lift using hamstrings and glutes while keeping hips high.', '["Stand over bar with feet hip-width, knees kept almost completely straight with slight micro-bend."]', '["Hinge down with high hips, grip bar, pull up using posterior chain, lower back to light floor touch."]',
  'Inhale at top, brace, exhale on way up.', '3-0-1-0', '3',
  '8-10', 120, '[{"mistake":"Hyper-flexing lower back","fix":"Only descend as far as your hamstring flexibility allows neutral spine."}]',
  'Use lighter weight than standard deadlifts.', 'Romanian Deadlift', 'Stiff-Leg Deadlift',
  'Deficit Stiff-Leg Deadlift', 'hamstrings, stiff-leg, posterior chain', 410, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e7e61f8b-2853-4e34-ae50-f62a6090d1f3', '0548aaae-d47d-410e-95fd-c03bff0d8ead', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a6b647bc-6812-4a0a-8f0d-7c3aa41ef8e7', 'Good Morning', 'good-morning', 'Barbell hip hinge with bar on upper back targeting hamstrings, glutes, and spinal erectors.',
  'Hamstrings', 'Lower Back, Glutes', 'Legs',
  'Barbell', 'Intermediate', 'Hinge',
  'Place barbell across upper traps, soft knees, hinge hips backward until torso is near parallel to floor, and return.', '["Barbell racked across upper traps, feet shoulder-width, knees softly bent."]', '["Hinge hips backward, keep back rigid as torso tilts forward, feel hamstring stretch, extend hips."]',
  'Inhale descending, exhale ascending.', '3-1-1-0', '3',
  '8-10', 90, '[{"mistake":"Squatting instead of hinging","fix":"Keep knees at fixed angle and push hips back."}]',
  'Start with light barbell to build lower back endurance.', 'Dumbbell RDL', 'Barbell Good Morning',
  'Seated Good Morning', 'hamstrings, lower back, hinge, strength', 360, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('25ef1365-60c3-483e-b214-94cfa2b4cd02', 'a6b647bc-6812-4a0a-8f0d-7c3aa41ef8e7', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'ee4560d5-0d77-47ab-9334-e75373c97976', 'Single-Leg Romanian Deadlift', 'single-leg-romanian-deadlift', 'Unilateral hinge building hamstring strength, ankle stability, and hip balance.',
  'Hamstrings', 'Glutes, Core, Calves', 'Legs',
  'Dumbbell', 'Intermediate', 'Hinge',
  'Stand on one leg, hinge forward extending other leg straight behind you, lower dumbbell to shin level, and return.', '["Stand balancing on one leg holding dumbbell in opposite hand."]', '["Hinge forward lifting rear leg in line with torso, feel hamstring load on working leg, return upright."]',
  'Inhale hinging down, exhale returning up.', '3-0-1-0', '3',
  '8-10 / leg', 60, '[{"mistake":"Opening hip outward","fix":"Keep hips square pointing directly toward floor."}]',
  'Place hand lightly on a wall for balance if needed.', 'Kickstand RDL', 'Single-Leg Dumbbell RDL',
  'Single-Leg Barbell RDL', 'hamstrings, unilateral, balance, athletic', 320, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('c5b5f08c-b80b-46ea-a8c5-ba4fa332cc05', 'ee4560d5-0d77-47ab-9334-e75373c97976', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'fa5d2025-ac49-474a-99bf-ab42963dd831', 'Barbell Hip Thrust', 'barbell-hip-thrust', 'The supreme glute hypertrophy exercise providing peak mechanical tension at full hip extension.',
  'Glutes', 'Hamstrings, Quadriceps, Adductors', 'Legs',
  'Barbell', 'Intermediate', 'Hinge',
  'Upper back against bench, barbell padded across hips, drive hips up to ceiling until thighs and torso align, squeeze glutes hard.', '["Sit on floor with upper back against bench pad, barbell with thick pad rolled over hips.","Set feet shoulder-width apart, shins vertical at top of thrust.","Tuck chin to chest, keep eyes looking forward at knees."]', '["Drive through heels and push hips upward into full extension.","Squeeze glutes aggressively for 1-2 seconds at the top (pelvis in slight posterior tilt).","Lower hips under control without hyperextending lower back."]',
  'Inhale at bottom, exhale and brace as you drive hips up to top lockout.', '2-1-1-1', '3-4',
  '8-12', 90, '[{"mistake":"Looking up at ceiling and hyperextending lower back","fix":"Keep chin tucked to chest and rotate around upper back."},{"mistake":"Feet too far forward (hamstrings take over)","fix":"Position feet so shins are strictly vertical at the top."}]',
  'Always use a thick barbell pad to prevent bruising on hip bones.', 'Glute Bridge on Floor', 'Barbell Hip Thrust',
  'Single-Leg Hip Thrust', 'glutes, hip thrust, hypertrophy, booty, strength', 390, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ae9776ac-21f0-4ce6-9b99-3587b52e1cc1', 'fa5d2025-ac49-474a-99bf-ab42963dd831', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a03245ef-fe6e-44ab-acdc-70b5c4733ae5', 'Cable Glute Kickback', 'cable-glute-kickback', 'Isolation exercise targeting gluteus maximus through terminal hip extension with constant cable tension.',
  'Glutes', 'Hamstrings', 'Legs',
  'Cable', 'Beginner', 'Isolation',
  'Attach ankle strap to low cable, kick leg backward in an arc squeezing glute at top, and return under control.', '["Attach strap to ankle, stand facing cable tower holding frame for support, slight forward torso lean."]', '["Kick leg back and slightly outward, squeeze glute at peak for 1s, return without swinging."]',
  'Exhale kicking back, inhale returning.', '2-1-1-1', '3',
  '12-15 / leg', 45, '[{"mistake":"Arching lower back to get leg higher","fix":"Keep torso stable and move purely from hip joint."}]',
  'Maintain tight abdominal brace.', 'Bodyweight Donkey Kicks', 'Cable Glute Kickback',
  'Cable Kickback on Incline Bench', 'glutes, cables, kickback, isolation', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('202b8c6a-eac5-4946-bd39-6e453b181561', 'a03245ef-fe6e-44ab-acdc-70b5c4733ae5', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'f37c88cd-daf5-49db-be7c-57c7a74380b9', 'Dumbbell Sumo Squat', 'dumbbell-sumo-squat', 'Wide-stance squat emphasizing glutes, adductors, and inner thighs.',
  'Glutes', 'Adductors, Quadriceps, Hamstrings', 'Legs',
  'Dumbbell', 'Beginner', 'Squat',
  'Take a wide stance with toes turned outward at 45 degrees, hold heavy dumbbell hanging between legs, squat down and drive up.', '["Stand with wide stance (1.5x shoulder-width), toes flared out 45 degrees, hold dumbbell vertically."]', '["Squat down pushing knees outward in line with toes, descend to parallel, squeeze glutes at top."]',
  'Inhale down, exhale up.', '3-1-1-0', '3',
  '10-12', 75, '[{"mistake":"Knees collapsing inward","fix":"Track knees over toes throughout."}]',
  'Keep torso upright.', 'Bodyweight Sumo Squat', 'Dumbbell Sumo Squat',
  'Barbell Sumo Squat', 'glutes, adductors, sumo, squat', 360, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('1754e626-dcaf-40d4-8174-112c7695b8bf', 'f37c88cd-daf5-49db-be7c-57c7a74380b9', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '49e803ce-2a35-4596-9669-7fbf38acbf8d', 'Glute Bridge', 'glute-bridge', 'Floor-based hip extension perfect for learning glute recruitment and high-rep pump.',
  'Glutes', 'Hamstrings, Core', 'Legs',
  'Bodyweight', 'Beginner', 'Hinge',
  'Lie on back with knees bent and feet flat, drive hips upward toward ceiling, squeeze glutes hard for 2s, lower.', '["Lie supine on mat, feet flat hip-width apart, arms at sides."]', '["Press through heels to lift hips until thighs and torso form straight line, hold 2s squeeze, lower."]',
  'Exhale lifting hips, inhale lowering.', '2-1-1-1', '3',
  '15-20', 45, '[{"mistake":"Hyperextending spine","fix":"Stop when hips are fully in line with ribs and thighs."}]',
  'Great warm-up activation drill before squats and deadlifts.', 'Bodyweight Glute Bridge', 'Dumbbell Glute Bridge',
  'Single-Leg Glute Bridge', 'glutes, bodyweight, bridge, beginner', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('6ae65e29-a02c-42b8-b766-9888125261f7', '49e803ce-2a35-4596-9669-7fbf38acbf8d', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '84a0cb05-4a31-4a06-b49a-0dcbbd93dd70', 'Seated Hip Abduction Machine', 'seated-hip-abduction-machine', 'Machine isolating the gluteus medius and minimus for hip stability and outer glute shape.',
  'Glutes', 'Abductors', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Sit in machine with pads against outer knees, push knees outward against resistance, hold 1s, return slowly.', '["Sit with back against pad, place outside of knees against pads, adjust starting pin."]', '["Push legs outward as far as possible, squeeze outer glutes for 1s, control the return."]',
  'Exhale pushing out, inhale returning.', '2-1-1-1', '3',
  '15-20', 45, '[{"mistake":"Using momentum and slamming weights","fix":"Control the entire range of motion."}]',
  'Leaning slightly forward can increase gluteus medius activation.', 'Banded Clamshells', 'Seated Hip Abduction Machine',
  'Standing Cable Hip Abduction', 'glutes, glute medius, abductors, machine', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('35b099b8-86d1-40fc-9e89-e1f6218687be', '84a0cb05-4a31-4a06-b49a-0dcbbd93dd70', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3ea8aa20-4533-4c21-a818-fa1d00412ee6', 'Cable Pull-Through', 'cable-pull-through', 'Low cable hip hinge loading the glutes and hamstrings with horizontal shear resistance.',
  'Glutes', 'Hamstrings, Lower Back', 'Legs',
  'Cable', 'Beginner', 'Hinge',
  'Stand facing away from low pulley holding rope between legs, hinge hips back, and snap hips forward to stand tall.', '["Set cable at lowest setting with rope, straddle cable facing away, take 2 steps forward."]', '["Hinge hips back letting cable pull hands between thighs, squeeze glutes and drive hips forward to lockout."]',
  'Inhale hinging back, exhale snapping hips forward.', '2-1-1-0', '3',
  '12-15', 60, '[{"mistake":"Pulling with arms","fix":"Keep arms straight like ropes; hips do all the work."}]',
  'Very safe way to master hip hinge without axial spinal loading.', 'Cable Pull-Through', 'Kettlebell Swing',
  'Barbell Hip Thrust', 'glutes, cable, hinge, safe', 280, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('60191bd8-67cd-4b37-ba3f-2654971bae0d', '3ea8aa20-4533-4c21-a818-fa1d00412ee6', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '1cc8a3fa-b1a8-4503-b1f6-bb11f7dd85c0', 'Hyperextension (Glute-Focused)', 'hyperextension-glute-focused', '45-degree back extension performed with rounded upper back and flared toes to isolate glutes.',
  'Glutes', 'Hamstrings, Lower Back', 'Legs',
  'Bench', 'Beginner', 'Hinge',
  'Position hips over 45-degree pad, round upper back slightly, flare toes out, lower torso, and squeeze glutes to rise.', '["Set pad just below hip crease, flare toes out 45 degrees, cross arms or hold plate."]', '["Lower torso down, round thoracic spine, drive hips into pad to lift torso until straight, squeeze glutes."]',
  'Inhale down, exhale squeezing up.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Arching lower back at the top","fix":"Keep upper back rounded so glutes do the extension."}]',
  'Do not hyperextend past parallel.', 'Bodyweight Glute Bridge', 'Glute-Focused 45-Degree Extension',
  'Weighted Glute Hyperextension', 'glutes, hyperextension, posterior chain', 270, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('3f83df79-b8e6-43df-afcc-077b8b88e0b3', '1cc8a3fa-b1a8-4503-b1f6-bb11f7dd85c0', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9fcdc024-8945-480d-8a33-fc6292a7fcf0', 'Banded Monster Walks', 'banded-monster-walks', 'Dynamic resistance band walk activating the gluteus medius and hip stabilizers.',
  'Glutes', 'Abductors', 'Legs',
  'Resistance Band', 'Beginner', 'Isolation',
  'Place loop band around ankles or above knees, get into quarter squat, take diagonal steps forward and backward.', '["Place mini loop band around ankles, stand in quarter squat with feet hip-width."]', '["Take diagonal steps forward while maintaining constant outward band tension, repeat backward."]',
  'Breathe smoothly throughout.', '1-0-1-0', '3',
  '15 steps each way', 45, '[{"mistake":"Letting feet come completely together","fix":"Keep constant tension on the band at all times."}]',
  'Excellent warm-up activation prior to squats.', 'Banded Side Clams', 'Banded Monster Walks',
  'Double Banded Monster Walks', 'glutes, bands, activation, warmup', 200, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('616a5304-8c18-4902-97d6-10a38f4a20be', '9fcdc024-8945-480d-8a33-fc6292a7fcf0', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'fb5db4a6-521b-452a-9584-df5b10c35d3e', 'Standing Calf Raise', 'standing-calf-raise', 'Heavy standing calf exercise prioritizing the gastrocnemius muscle under full ankle plantarflexion.',
  'Calves', 'Soleus', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Place balls of feet on block with straight knees, lower heels for deep stretch, rise onto tiptoes, and hold 1s squeeze.', '["Position shoulders under pads, balls of feet on block, knees straight with micro-softness."]', '["Lower heels into deep 2-second stretch, drive up onto big toes, squeeze calves hard for 1s, lower slowly."]',
  'Exhale rising onto toes, inhale lowering heels.', '3-1-1-1', '3-4',
  '10-15', 60, '[{"mistake":"Bouncing at the bottom using Achilles tendon elasticity","fix":"Pause for 2 full seconds at the bottom stretch to eliminate bounce."}]',
  'Do not bend knees; keep legs straight to target gastrocnemius.', 'Standing Bodyweight Calf Raise', 'Standing Machine Calf Raise',
  'Single-Leg Standing Dumbbell Calf Raise', 'calves, gastrocnemius, machine, legs', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('87fad735-1067-4eac-b268-761101769ecc', 'fb5db4a6-521b-452a-9584-df5b10c35d3e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'cc1ce35e-bf44-4f89-baea-a62bb14b20b1', 'Seated Calf Raise', 'seated-calf-raise', 'Bent-knee calf raise specifically targeting the deep soleus muscle.',
  'Calves', 'None', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Sit with knees at 90 degrees under thigh pads, lower heels below platform, press up onto balls of feet, and squeeze.', '["Sit in machine, balls of feet on block, thigh pads adjusted snugly over lower quadriceps."]', '["Lower heels for full stretch, push through balls of feet to full plantarflexion, squeeze 1s, lower with control."]',
  'Exhale pressing up, inhale descending.', '3-1-1-1', '3',
  '12-20', 60, '[{"mistake":"Rushing reps","fix":"Soleus responds best to controlled tempo and pauses."}]',
  'Release the safety pin smoothly before initiating set.', 'Seated Calf Raise with Dumbbells on Knees', 'Seated Calf Raise Machine',
  'Single-Leg Seated Calf Raise', 'calves, soleus, seated, machine', 200, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('415a12c7-2671-4603-acbd-2666dc43728e', 'cc1ce35e-bf44-4f89-baea-a62bb14b20b1', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9ce29fca-3352-4336-8bb6-3f2196c9fa4e', 'Leg Press Calf Raise', 'leg-press-calf-raise', 'Performing calf raises on the 45-degree leg press sled for heavy gastrocnemius loading.',
  'Calves', 'Soleus', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Place balls of feet on bottom lip of leg press platform, extend ankles forward, squeeze calves, and lower heels into stretch.', '["Sit in 45-degree leg press, place balls of feet on bottom edge of footplate with heels hanging free."]', '["Press sled forward with ankles, hold peak contraction 1s, lower slowly into deep stretch."]',
  'Exhale pressing forward, inhale stretching back.', '3-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Feet slipping off edge","fix":"Wear grippy shoes and place balls of feet securely."}]',
  'Always keep safety locks engaged at closest stop in case of slip.', 'Standing Calf Raise', 'Leg Press Calf Raise',
  'Single-Leg Leg Press Calf Raise', 'calves, leg press, machine, heavy', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('402351bb-53be-491b-9cb0-bdc885f4de6c', '9ce29fca-3352-4336-8bb6-3f2196c9fa4e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '6370e3df-d91c-4a8b-ac94-8498086036b3', 'Donkey Calf Raise', 'donkey-calf-raise', 'Hip-hinged calf raise placing maximum stretch on the gastrocnemius through hip flexion.',
  'Calves', 'Soleus, Hamstrings', 'Legs',
  'Machine', 'Intermediate', 'Isolation',
  'Hinge forward at 90 degrees with hips under machine pad, lower heels, and rise onto toes.', '["Hinge forward at 90 degrees with pad resting across lower back/sacrum, balls of feet on step."]', '["Lower heels deep, drive onto toes, squeeze calves hard for 1s, return with 3s tempo."]',
  'Exhale up, inhale down.', '3-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Bending knees","fix":"Keep legs straight throughout."}]',
  'Arnold Schwarzenegger favorite for calf development.', 'Standing Calf Raise', 'Donkey Calf Raise',
  'Weighted Donkey Calf Raise', 'calves, donkey, classic, mass', 230, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('94cc9299-b98f-4236-8b6c-90a754c64bb0', '6370e3df-d91c-4a8b-ac94-8498086036b3', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'ca3f6021-bf39-44fc-96cf-679937384cfe', 'Single-Leg Bodyweight Calf Raise', 'single-leg-bodyweight-calf-raise', 'Unilateral calf exercise on a step requiring zero equipment while providing high muscular stimulation.',
  'Calves', 'Soleus', 'Legs',
  'Bodyweight', 'Beginner', 'Isolation',
  'Stand on one foot on a step ledge, lower heel into deep stretch, drive up to peak height, and pause.', '["Stand on edge of step with one foot, hook other foot behind ankle, touch wall for balance."]', '["Lower heel for 2s deep stretch, rise high onto big toe, squeeze 1s, lower under control."]',
  'Exhale up, inhale down.', '3-1-1-1', '3',
  '15-20 / leg', 45, '[{"mistake":"Partial range of motion","fix":"Go from absolute lowest stretch to highest point."}]',
  'Hold onto a rail or wall for balance.', 'Two-Leg Bodyweight Calf Raise', 'Single-Leg Calf Raise',
  'Single-Leg Calf Raise with Dumbbell', 'calves, bodyweight, home workout, unilateral', 200, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('8e54c0c6-0273-4931-8509-318fa374e5ef', 'ca3f6021-bf39-44fc-96cf-679937384cfe', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5813da6e-b127-44c8-906e-a667c2a17005', 'Tibialis Anterior Raise', 'tibialis-anterior-raise', 'Shin exercise strengthening the front of the lower leg to bulletproof knees and prevent shin splints.',
  'Calves', 'Tibialis Anterior', 'Legs',
  'Bodyweight', 'Beginner', 'Isolation',
  'Lean back against wall with heels out, flex toes upward toward shins, hold squeeze 1s, and lower.', '["Lean upper back against wall, walk heels roughly 1-2 feet out in front of you."]', '["Pull toes and forefeet upward toward shins as high as possible, hold 1s, lower slowly."]',
  'Exhale lifting toes, inhale lowering.', '2-1-1-1', '3',
  '15-25', 45, '[{"mistake":"Bending knees","fix":"Keep legs straight against wall."}]',
  'Outstanding for runners and jumping athletes.', 'Wall Tibialis Raise', 'Tib Bar Raise',
  'Dumbbell Ankle Tibialis Raise', 'tibialis, shin, kneesovertoes, prehab', 180, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('fc6bc6f3-1591-4bbb-8bf4-cfb275c80a1f', '5813da6e-b127-44c8-906e-a667c2a17005', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9c7d5fab-8fe5-444a-b832-584ce01d5083', 'Hanging Leg Raise', 'hanging-leg-raise', 'The premier lower abdominal and core compression exercise performed from a dead hang.',
  'Abs', 'Hip Flexors, Forearms, Lats', 'Core',
  'Bodyweight', 'Intermediate', 'Isolation',
  'Hang from pull-up bar, tuck pelvis, raise legs straight up until toes touch or approach the bar, and lower slowly.', '["Hang with straight arms from pull-up bar, engage lats and lock pelvis into posterior tilt."]', '["Curl pelvis upward and lift legs toward bar without swinging, pause, lower slowly with a 3s eccentric."]',
  'Exhale forcefully as legs rise, inhale lowering legs.', '3-0-1-1', '3',
  '10-15', 60, '[{"mistake":"Swinging legs with momentum","fix":"Pause at bottom and flex abs to initiate every rep."},{"mistake":"Lifting legs purely with hip flexors","fix":"Round pelvis upward to recruit rectus abdominis."}]',
  'Bend knees to decrease lever length if straight leg raise is too challenging.', 'Hanging Knee Raise', 'Hanging Leg Raise',
  'Toes to Bar', 'abs, core, lower abs, calisthenics, hanging', 280, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('9f0b986b-fdab-47d6-b500-223d421c9abc', '9c7d5fab-8fe5-444a-b832-584ce01d5083', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '1a5d404e-62ed-44ba-a9de-c5c47e38ecbc', 'Cable Crunch', 'cable-crunch', 'Kneeling cable crunch providing heavy progressive overload resistance directly onto the rectus abdominis.',
  'Abs', 'Obliques', 'Core',
  'Cable', 'Beginner', 'Isolation',
  'Kneel holding rope beside ears, flex spine rounding elbows toward knees, squeeze abs hard, and return under control.', '["Kneel in front of high cable holding rope handles pinned to sides of head/ears, hips stationary."]', '["Contract abs to round spine downward, bringing elbows toward mid-thighs, squeeze 1s, return with control."]',
  'Exhale hard blowing all air out as you crunch down, inhale returning.', '2-1-1-1', '3-4',
  '12-15', 60, '[{"mistake":"Sitting back onto heels (hip hinge)","fix":"Keep hips locked in place; movement must be spinal flexion."}]',
  'Focus on flexing the spine rather than pulling with arms.', 'Floor Crunch', 'Cable Crunch',
  'Standing Cable Crunch', 'abs, core, cables, hypertrophy, six pack', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ea5b9af1-681d-4fd8-8e41-88618717bd48', '1a5d404e-62ed-44ba-a9de-c5c47e38ecbc', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'cd418aa1-1396-4303-8d01-f6964759eb25', 'Ab Wheel Rollout', 'ab-wheel-rollout', 'Advanced anti-extension core exercise building bulletproof abdominal wall strength.',
  'Abs', 'Lats, Shoulders, Lower Back', 'Core',
  'Bodyweight', 'Advanced', 'Isolation',
  'Kneel with hands on ab wheel, roll forward keeping hollow body position until nose is near floor, and pull back with abs.', '["Kneel on pad holding ab wheel handles directly under shoulders, tuck pelvis into hollow hold."]', '["Roll wheel forward extending arms and hips, keep core clamped, pull back through abs to return."]',
  'Inhale rolling out, exhale pulling back.', '3-0-1-0', '3',
  '8-12', 75, '[{"mistake":"Lower back sagging into arch","fix":"Keep posterior pelvic tilt (\"tail tucked between legs\") throughout."}]',
  'Do not roll out further than you can maintain a rigid flat/rounded lower back.', 'Plank', 'Kneeling Ab Wheel Rollout',
  'Standing Ab Wheel Rollout', 'abs, ab wheel, anti-extension, advanced core', 310, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a88af37c-4636-49f3-98ca-93774af4763e', 'cd418aa1-1396-4303-8d01-f6964759eb25', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '23de4fb1-5825-4c3b-9235-14e1ee697416', 'Plank', 'plank', 'Foundational isometric anti-extension and core stabilization exercise.',
  'Abs', 'Shoulders, Glutes, Lower Back', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'Rest on forearms and toes in a rigid straight line, brace abs as if about to be punched, squeeze glutes, and hold.', '["Rest on forearms with elbows beneath shoulders, feet together, body in straight line."]', '["Squeeze glutes, pull belly button into spine, create full-body tension, hold for target time."]',
  'Breathe shallowly into chest while maintaining deep abdominal brace.', 'Isometric', '3',
  '45-60 sec hold', 45, '[{"mistake":"Sagging hips or sticking butt in the air","fix":"Keep body in strict straight line from head to heels."}]',
  'End set if lower back begins to ache or arch.', 'Knee Plank', 'Standard Forearm Plank',
  'RKC Hardstyle Plank with Active Pull', 'abs, plank, isometric, stability', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b246e958-26ea-4fc6-905f-030c7d20be3a', '23de4fb1-5825-4c3b-9235-14e1ee697416', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'e2ad3cd2-1454-4c3c-808a-d954e44b7484', 'Russian Twist', 'russian-twist', 'Rotational core exercise targeting internal and external obliques and deep transverse abdominis.',
  'Abs', 'Obliques, Hip Flexors', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'Sit in V-shape with feet elevated, rotate torso side to side touching hands or weight to floor on each side.', '["Sit on floor with knees bent, lean torso back 45 degrees, elevate feet 3 inches off floor."]', '["Rotate shoulders and torso to touch floor on right, rotate smoothly to left, maintain V-sit."]',
  'Exhale on each twist, inhale passing through center.', '1-0-1-0', '3',
  '20 total twists', 45, '[{"mistake":"Only moving arms without rotating torso","fix":"Turn shoulders completely from side to side."}]',
  'Keep chest open and spine straight.', 'Feet-on-Floor Russian Twist', 'Weighted Russian Twist',
  'Decline Bench Russian Twist with Medicine Ball', 'obliques, core, rotational, abs', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('28f5ceb7-12c4-450a-9ad2-542de0ce6248', 'e2ad3cd2-1454-4c3c-808a-d954e44b7484', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '9851e3d7-98f8-48a6-b633-d2ea78adc025', 'Dead Bug', 'dead-bug', 'Precision anti-extension and cross-body motor control core exercise protecting lower back.',
  'Abs', 'Hip Flexors, Shoulders', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'Lie on back with arms and knees in air at 90 degrees, press lower back to floor, extend opposite arm and leg simultaneously.', '["Lie supine, knees at 90 degrees, arms pointing to ceiling, flatten lower back into mat."]', '["Slowly extend right arm overhead and left leg down near floor, keep lower back glued to floor, return and switch."]',
  'Exhale extending limbs, inhale returning.', '2-1-2-0', '3',
  '10-12 / side', 45, '[{"mistake":"Lower back arching off mat","fix":"Only lower leg as far as you can maintain flat lumbar contact."}]',
  'Excellent rehabilitation and foundational core movement.', 'Dead Bug with Feet Tapping', 'Standard Dead Bug',
  'Weighted Dead Bug with Dumbbells', 'core, stability, lower back friendly, rehab', 190, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b69954b3-ac6a-43d6-a09d-e9e12620660e', '9851e3d7-98f8-48a6-b633-d2ea78adc025', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5350ff62-07a4-4d26-b973-bff069bbfb45', 'Mountain Climbers', 'mountain-climbers', 'Dynamic plank exercise combining cardiovascular conditioning with isometric core endurance.',
  'Abs', 'Shoulders, Hip Flexors, Quadriceps', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'High plank position, drive knees alternately toward chest in a running cadence while keeping hips level.', '["Start in high plank with hands beneath shoulders, core engaged."]', '["Drive right knee toward chest, quickly return and drive left knee, maintain steady tempo."]',
  'Breathe rhythmically.', 'Fast Cadence', '3',
  '30-45 sec', 45, '[{"mistake":"Bouncing hips high in air","fix":"Keep hips low and level in plank line."}]',
  'Land lightly on balls of feet.', 'Slow Controlled Mountain Climbers', 'Cross-Body Mountain Climbers',
  'Slider Mountain Climbers', 'cardio, core, dynamic, fat loss', 380, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('97b5e8b6-eb62-4096-8435-7971ab4dd2ff', '5350ff62-07a4-4d26-b973-bff069bbfb45', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'c9e39b9a-64b4-4f5e-98ef-e51e0ae0ac91', 'Side Plank', 'side-plank', 'Isometric anti-lateral flexion exercise targeting obliques, quadratus lumborum, and gluteus medius.',
  'Abs', 'Obliques, Glutes, Shoulders', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'Lie on side supported on forearm, lift hips until body forms straight diagonal line, and hold.', '["Lie on side with forearm flat beneath shoulder, feet stacked or staggered."]', '["Raise hips off floor into straight line, hold position with tight core and glutes."]',
  'Breathe steadily throughout hold.', 'Isometric', '3',
  '30-45 sec / side', 45, '[{"mistake":"Hips sagging toward floor","fix":"Push bottom hip high toward ceiling."}]',
  'Do not roll top shoulder forward.', 'Knee Side Plank', 'Standard Side Plank',
  'Side Plank with Leg Lift', 'obliques, core, stability, side plank', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('00b16415-4fdd-4fa2-a819-51ec312305fe', 'c9e39b9a-64b4-4f5e-98ef-e51e0ae0ac91', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '20e8bae3-8108-4dda-a5f8-48f1925c0dd6', 'Dragon Flag', 'dragon-flag', 'Legendary advanced calisthenics core exercise popularized by Bruce Lee, demanding full-body tension.',
  'Abs', 'Lats, Lower Back, Glutes', 'Core',
  'Bench', 'Advanced', 'Isolation',
  'Lie on bench gripping behind head, lift entire body vertically pivoting only on upper back, and lower body rigid as a board.', '["Lie on flat bench, grip edge of bench behind head firmly, pivot on upper shoulders."]', '["Raise entire body straight up to vertical, lower slowly keeping body completely straight, stop an inch off bench, pull up."]',
  'Exhale raising up, inhale on controlled descent.', '3-0-1-0', '3',
  '5-8', 90, '[{"mistake":"Bending at hips","fix":"Keep line from shoulders to toes locked like an iron rod."}]',
  'Master hanging leg raises and ab rollouts first.', 'Dragon Flag Negatives with Tucked Knees', 'One-Leg Dragon Flag',
  'Full Dragon Flag', 'abs, calisthenics, elite core, bruce lee', 350, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0bd4ccfe-0b36-4729-a7ee-d7f75f67f418', '20e8bae3-8108-4dda-a5f8-48f1925c0dd6', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '71d4804a-94f1-4799-bfeb-24bb975ebb95', 'Pallof Press', 'pallof-press', 'Top-tier anti-rotation core exercise training rotational stability and spinal stiffness.',
  'Abs', 'Obliques, Shoulders, Glutes', 'Core',
  'Cable', 'Beginner', 'Isolation',
  'Stand perpendicular to cable pulley holding handle at sternum, press hands forward resisting cable twist, hold 2s, return.', '["Set cable at chest height, stand sideways with feet shoulder-width, hold handle with both hands at chest."]', '["Press hands straight out in front of chest, resist rotation for 2s, bring hands back to chest with control."]',
  'Exhale pressing out, inhale returning.', '2-2-1-0', '3',
  '10-12 / side', 45, '[{"mistake":"Allowing torso to twist toward cable","fix":"Keep shoulders and hips square forward."}]',
  'Outstanding for athletic performance and lower back health.', 'Banded Pallof Press', 'Cable Pallof Press',
  'Kneeling Cable Pallof Press with Overhead Raise', 'core, anti-rotation, athletic, stability', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('aee7fc6b-a0ec-4ef7-b3ee-a1d2523dba6d', '71d4804a-94f1-4799-bfeb-24bb975ebb95', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'e007f66b-6aac-41ed-81f8-efe695570160', 'Barbell Shrug', 'barbell-shrug', 'Heavy vertical elevation of the scapulae for building massive upper trapezius thickness.',
  'Traps', 'Forearms, Upper Back', 'Back',
  'Barbell', 'Beginner', 'Isolation',
  'Hold barbell in front of thighs, elevate shoulders straight up toward ears, squeeze traps for 2s, and lower slowly.', '["Stand tall holding barbell with shoulder-width grip, arms straight."]', '["Shrug shoulders straight up toward ears, hold peak contraction 2s, lower under control into deep stretch."]',
  'Exhale shrugging up, inhale lowering.', '2-2-1-0', '3-4',
  '10-15', 75, '[{"mistake":"Rolling shoulders in circles","fix":"Shrug straight up and down; rolling damages rotator cuff."}]',
  'Use lifting straps for heavy sets if grip fails.', 'Dumbbell Shrug', 'Barbell Shrug',
  'Behind-the-Back Barbell Shrug', 'traps, shrugs, upper back, mass', 260, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('e4802759-78c9-4dc9-9a53-319ba344a4cc', 'e007f66b-6aac-41ed-81f8-efe695570160', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '49814443-75e7-4d7c-9ad9-08d9af6aa8d2', 'Dumbbell Shrug', 'dumbbell-shrug', 'Shrug with dumbbells at sides providing natural arm alignment and independent shoulder elevation.',
  'Traps', 'Forearms', 'Back',
  'Dumbbell', 'Beginner', 'Isolation',
  'Hold heavy dumbbells at sides, shrug shoulders straight up toward ears, squeeze for 2s, and lower.', '["Stand tall with dumbbells hanging at sides, palms facing inward."]', '["Elevate shoulders straight up toward ears, pause 2s, lower to full bottom stretch."]',
  'Exhale shrugging up, inhale lowering.', '2-2-1-0', '3',
  '12-15', 60, '[{"mistake":"Bending elbows to assist lift","fix":"Keep arms straight like ropes."}]',
  'Keep neck in neutral alignment; do not look down.', 'Seated Dumbbell Shrug', 'Standing Dumbbell Shrug',
  'Incline Prone Dumbbell Shrug', 'traps, dumbbells, shrugs', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('8996b164-ecbc-427c-b43b-61ab955e602f', '49814443-75e7-4d7c-9ad9-08d9af6aa8d2', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '0afd442d-8b88-4690-b008-b21d001b1e55', 'Trap Bar Shrug', 'trap-bar-shrug', 'Shrug performed inside a hex bar, placing load directly in line with center of gravity with neutral grip.',
  'Traps', 'Forearms', 'Back',
  'Barbell', 'Intermediate', 'Isolation',
  'Stand inside trap bar, lift to standing, shrug shoulders straight up to ears, squeeze and lower.', '["Stand in center of trap bar, grip neutral handles, stand upright."]', '["Shrug vertically, squeeze traps at top for 2 seconds, lower slowly."]',
  'Exhale up, inhale down.', '2-2-1-0', '3-4',
  '10-12', 90, '[{"mistake":"Jerking with knees","fix":"Isolate scapular elevation strictly."}]',
  'Superior for wrist and shoulder alignment compared to straight bar.', 'Dumbbell Shrug', 'Trap Bar Shrug',
  'Trap Bar Shrug with 3s Pause', 'traps, hex bar, heavy overload', 290, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('f8f1f314-da0c-469b-8822-9493473bcfb4', '0afd442d-8b88-4690-b008-b21d001b1e55', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '04e627a9-0d40-463e-b132-6b007c6167ca', 'Cable Rope Upright Row (Traps Focus)', 'cable-rope-upright-row', 'Upright row using rope on low cable to allow wide pull angle and upper trap activation.',
  'Traps', 'Shoulders, Biceps', 'Back',
  'Cable', 'Beginner', 'Vertical Pull',
  'Hold rope attachment on low pulley, pull rope up toward collarbones spreading ends apart, squeeze traps, and lower.', '["Stand facing low pulley holding rope with overhand grip."]', '["Pull rope upward leading with elbows, spread hands at top, squeeze traps, lower under control."]',
  'Exhale pulling up, inhale lowering.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Pulling higher than collarbones","fix":"Stop at mid-chest to avoid shoulder impingement."}]',
  'Smooth continuous cable resistance.', 'Cable Shrug', 'Cable Rope Upright Row',
  'High Pull from Hang', 'traps, cables, shoulders', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('cbdccb9e-1f8b-4eb5-850c-f0dde37609d8', '04e627a9-0d40-463e-b132-6b007c6167ca', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2e1b97de-ce2f-4bfe-bf9a-8c19f1f4661e', 'Kelso Shrug (Chest Supported)', 'kelso-shrug', 'Prone incline dumbbell shrug isolating the mid and lower trapezius and rhomboids.',
  'Traps', 'Rhomboids', 'Back',
  'Dumbbell', 'Intermediate', 'Isolation',
  'Lie chest down on 30-degree incline bench holding dumbbells, retract and elevate scapulae together without bending elbows.', '["Lie chest-down on incline bench, dumbbells hanging straight down, arms fully extended."]', '["Retract and pull shoulder blades together and upward, hold squeeze for 2s, lower to full stretch."]',
  'Exhale retracting, inhale releasing.', '2-2-1-0', '3',
  '12-15', 60, '[{"mistake":"Bending elbows into a row","fix":"Keep arms completely straight; move only shoulder blades."}]',
  'Crucial exercise for scapular control and shoulder health.', 'Scapular Pull-Downs', 'Kelso Shrug',
  'Barbell Seal Shrug', 'traps, mid traps, posture, scapular health', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('be3825c1-4831-4619-ade1-8a25bd343c71', '2e1b97de-ce2f-4bfe-bf9a-8c19f1f4661e', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '627dd2e6-494d-422c-b418-28e6ba938a18', 'Barbell Wrist Curl', 'barbell-wrist-curl', 'Forearm flexor isolation exercise for increasing wrist strength and inner forearm mass.',
  'Forearms', 'Grip', 'Arms',
  'Barbell', 'Beginner', 'Isolation',
  'Rest forearms on bench with palms facing up holding barbell, curl wrists upward, and lower under control.', '["Kneel beside flat bench, rest forearms flat on bench with wrists hanging over edge, palms facing up."]', '["Curl wrists upward toward ceiling, squeeze inner forearms, lower wrists into full stretch."]',
  'Exhale curling wrists, inhale lowering.', '2-1-1-1', '3',
  '15-20', 45, '[{"mistake":"Lifting forearms off bench","fix":"Keep forearms glued flat to the pad."}]',
  'Do not use excessive weight; high reps work best.', 'Dumbbell Wrist Curl', 'Barbell Wrist Curl',
  'Behind-the-Back Standing Wrist Curl', 'forearms, grip, arms, isolation', 180, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('7b61770a-2f8f-493d-9737-456d53983ba0', '627dd2e6-494d-422c-b418-28e6ba938a18', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'bb3b5667-deae-4c76-ac22-9ffdc93f890b', 'Reverse Barbell Curl', 'reverse-barbell-curl', 'Overhand grip curl targeting the brachioradialis and forearm extensors.',
  'Forearms', 'Biceps (Brachialis)', 'Arms',
  'Barbell', 'Beginner', 'Isolation',
  'Hold EZ-bar with overhand (pronated) grip, stand tall, curl bar up to chest level, and lower slowly.', '["Stand tall holding EZ-bar with overhand grip shoulder-width."]', '["Curl bar upward keeping wrists neutral, squeeze tops of forearms, lower with a 3s eccentric."]',
  'Exhale curling up, inhale lowering down.', '3-0-1-0', '3',
  '10-12', 60, '[{"mistake":"Letting wrists bend backwards (extension)","fix":"Keep wrists rigidly straight throughout."}]',
  'Use an EZ-bar for wrist comfort.', 'Reverse Dumbbell Curl', 'Reverse EZ-Bar Curl',
  'Reverse Cable Curl with Rope', 'forearms, brachioradialis, arms', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('15c385c2-bd73-4c7c-a5de-0a1dff00383c', 'bb3b5667-deae-4c76-ac22-9ffdc93f890b', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '2d8792e3-e3c1-4449-8d18-672eb1ddd2ae', 'Farmer''s Walk', 'farmers-walk', 'Heavy loaded carry building crushing grip strength, forearm endurance, traps, and core stability.',
  'Forearms', 'Traps, Core, Glutes, Calves', 'Full Body',
  'Dumbbell', 'Intermediate', 'Carry',
  'Pick up heavy dumbbells or farmer handles, stand tall with shoulders packed, and walk with short deliberate steps.', '["Deadlift heavy dumbbells at sides, stand tall with chest proud and shoulders back."]', '["Walk forward in a straight line with steady controlled steps, keep torso upright, do not let weights sway."]',
  'Breathe steadily while maintaining abdominal brace.', 'Steady Walk', '3-4',
  '30-40 meters', 90, '[{"mistake":"Slouching forward or shrugging too high","fix":"Retract and depress shoulder blades."}]',
  'Set weights down safely by hinging hips like a deadlift.', 'Light Dumbbell Carry', 'Heavy Farmer''s Walk',
  'Trap Bar Carry', 'grip, forearms, carry, functional, strength', 420, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ae843ae8-3ef4-4ca5-8b38-e1dd2f4faa7f', '2d8792e3-e3c1-4449-8d18-672eb1ddd2ae', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '7dc277e9-fe64-4c62-a0eb-646252087d95', 'Dead Hang', 'dead-hang', 'Static bodyweight hang from pull-up bar for grip endurance, forearm development, and spinal decompression.',
  'Forearms', 'Lats, Shoulders', 'Arms',
  'Bodyweight', 'Beginner', 'Isolation',
  'Hang from pull-up bar with overhand grip with feet off floor, hold for target time, and step down safely.', '["Grip pull-up bar shoulder-width with overhand grip, step off box into full hang."]', '["Hang relaxed allowing gravity to stretch spine, grip bar tight, hold for time."]',
  'Deep rhythmic breathing.', 'Isometric', '3',
  '45-90 sec hold', 60, '[{"mistake":"Letting grip slip gradually without resetting","fix":"Grip bar deep in palm."}]',
  'Excellent for shoulder decompression and spinal health.', 'Assisted Dead Hang with Toes on Floor', 'Bodyweight Dead Hang',
  'Single-Arm Dead Hang', 'grip, forearms, hang, spine decompression', 180, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('ba52aad0-9d76-45a4-985f-acd76bbab57f', '7dc277e9-fe64-4c62-a0eb-646252087d95', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a41e52ef-4c8b-4116-a1dc-f2c625f60c14', 'Plate Pinch Hold', 'plate-pinch-hold', 'Pinch grip isometric exercise targeting finger extensors/flexors and thumb strength.',
  'Forearms', 'Grip', 'Arms',
  'Barbell', 'Intermediate', 'Isolation',
  'Pinch smooth sides of two weight plates together with fingers and thumb, stand tall and hold for time.', '["Place two weight plates smooth sides facing out, pinch tops with fingers and thumb."]', '["Stand upright holding plates at sides, hold for maximum time without dropping."]',
  'Normal breathing.', 'Isometric', '3',
  '20-40 sec hold', 60, '[{"mistake":"Hooking fingers under rim","fix":"Pinch flat smooth surface purely with friction."}]',
  'Stand clear of feet in case plates slip.', 'Single Plate Pinch', 'Two Plate Pinch Hold',
  'Wide Block Pinch Hold', 'grip, pinch, forearms, finger strength', 170, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('09bbaa21-041e-410b-8492-6be0a2907c53', 'a41e52ef-4c8b-4116-a1dc-f2c625f60c14', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '6ced3ff4-b537-47c7-bde1-fbe011611b9b', 'Back Extension (45-Degree)', 'back-extension-45-degree', 'Erector spinae strengthening exercise building lower back stamina and preventing disc fatigue.',
  'Lower Back', 'Glutes, Hamstrings', 'Back',
  'Bench', 'Beginner', 'Hinge',
  'Position hips against pad on 45-degree bench, lower torso toward floor, and raise torso until body is straight.', '["Set pad just below hip crease, feet hooked under rollers, cross arms over chest."]', '["Hinge at hips lowering torso down, extend back up using lower back and glutes until torso aligns with legs."]',
  'Inhale descending, exhale ascending.', '2-1-1-0', '3',
  '12-15', 60, '[{"mistake":"Hyperextending spine backwards past straight line","fix":"Stop when body forms a straight diagonal line."}]',
  'Move smoothly without swinging.', 'Floor Bird Dog', 'Bodyweight 45-Degree Extension',
  'Weighted 45-Degree Extension with Barbell', 'lower back, erectors, posture, posterior chain', 240, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('a60aacc8-c209-40e0-82f7-b9a972920eda', '6ced3ff4-b537-47c7-bde1-fbe011611b9b', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '1ebf574b-4e3b-4da9-af8a-f56109560c89', 'Bird-Dog', 'bird-dog', 'Stuart McGill foundational core and lower back stability exercise promoting rotary stability.',
  'Lower Back', 'Glutes, Abs, Shoulders', 'Core',
  'Bodyweight', 'Beginner', 'Isolation',
  'Start on hands and knees, reach right arm forward and left leg straight back, hold 3s, return, and alternate.', '["On all fours with hands under shoulders and knees under hips, flat neutral spine."]', '["Extend right arm forward and left leg back parallel to floor, hold 3s without rotating pelvis, return and switch sides."]',
  'Breathe smoothly throughout hold.', '1-3-1-0', '3',
  '8-10 / side', 45, '[{"mistake":"Lifting leg too high and hyperextending lumbar","fix":"Reach straight back with heel, not up."}]',
  'The gold standard for spinal rehabilitation.', 'Bird-Dog', 'Bird-Dog with Isometric Squares',
  'Bird-Dog from Plank Position', 'lower back, mcgill big 3, rehab, core', 180, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0f7e25f0-69af-467c-a0b0-071fbc388b32', '1ebf574b-4e3b-4da9-af8a-f56109560c89', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '54792770-3da9-4a1f-8799-73a9565069e9', 'Superman', 'superman', 'Prone floor extension targeting erector spinae, glutes, and posterior chain.',
  'Lower Back', 'Glutes, Upper Back, Hamstrings', 'Back',
  'Bodyweight', 'Beginner', 'Isolation',
  'Lie face down with arms extended forward, simultaneously lift chest, arms, and legs off floor, hold 2s, and lower.', '["Lie prone on mat with arms outstretched ahead and legs straight."]', '["Contract lower back and glutes to lift chest and thighs 2-4 inches off mat, hold 2s squeeze, lower."]',
  'Exhale lifting, inhale lowering.', '2-2-1-0', '3',
  '12-15', 45, '[{"mistake":"Jerking head backwards","fix":"Keep neck neutral looking at floor."}]',
  'Do not over-arch.', 'Alternating Superman (one limb at a time)', 'Superman',
  'Superman with Isometric 5s Holds', 'lower back, bodyweight, home workout', 200, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('0fefcd55-e2f1-4fa2-8447-783d58f2b1f1', '54792770-3da9-4a1f-8799-73a9565069e9', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a349a720-b737-487e-a3da-1abf31c9959a', 'Jefferson Curl', 'jefferson-curl', 'Segmental spinal flexion and extension mobility movement building loaded spinal resilience and hamstring flexibility.',
  'Lower Back', 'Hamstrings, Glutes', 'Back',
  'Barbell', 'Advanced', 'Hinge',
  'Stand on a box holding light weight, roll spine down vertebra by vertebra into full flexion below feet, and unroll back up.', '["Stand on plyo box, legs straight, hold very light weight (5-10kg)."]', '["Tuck chin to chest, round neck, then upper back, then lower back sequentially, reach below feet, reverse slowly."]',
  'Breathe slowly and deeply throughout.', '4-1-4-0', '3',
  '5-8', 75, '[{"mistake":"Using heavy weights too soon","fix":"Start with empty hands or light kettlebell."}]',
  'Perform only with controlled, light loads and strict slow tempo.', 'Standing Roll Down (Unweighted)', 'Light Dumbbell Jefferson Curl',
  'Barbell Jefferson Curl', 'spinal mobility, lower back, flexibility', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('b9fe8ae2-ffd4-4a40-81be-080e3697ad31', 'a349a720-b737-487e-a3da-1abf31c9959a', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '0a3ed1b0-6468-4c66-b2c5-87bbd003b4fb', 'Reverse Hyperextension', 'reverse-hyperextension', 'Patented Louie Simmons movement decompressing the lumbar spine while strengthening glutes and erectors.',
  'Lower Back', 'Glutes, Hamstrings', 'Back',
  'Machine', 'Intermediate', 'Hinge',
  'Lie face down on reverse hyper machine holding handles, pendulum swing legs up until horizontal, squeeze, and lower.', '["Lie prone on machine with hips at edge of pad, strap around ankles, grip handles firmly."]', '["Swing legs upward using glutes and lower back until aligned with torso, pause 1s, allow legs to swing under into decompression."]',
  'Exhale lifting legs, inhale as legs swing under.', '2-1-1-0', '3-4',
  '12-15', 75, '[{"mistake":"Swinging out of control","fix":"Control the top contraction and bottom traction."}]',
  'One of the best machines for lower back disc rehabilitation.', 'Floor Reverse Hyper on Bench', 'Reverse Hyperextension Machine',
  'Weighted Reverse Hyperextension', 'lower back, decompression, glutes, powerlifting', 280, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('7f083299-d2a6-43ac-9bb6-f8aad430c55b', '0a3ed1b0-6468-4c66-b2c5-87bbd003b4fb', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '062260f6-598a-4171-b655-8ac097049b1d', 'Seated Hip Adduction Machine', 'seated-hip-adduction-machine', 'Machine isolating the adductor magnus and longus (inner thighs) for hip strength and groin injury prevention.',
  'Adductors', 'Glutes (stabilizer)', 'Legs',
  'Machine', 'Beginner', 'Isolation',
  'Sit in machine with pads inside knees, pull knees together against resistance until pads touch, hold 1s, and release slowly.', '["Sit in machine with back pad adjusted, legs spread wide with pads on inner knees."]', '["Squeeze knees together smoothly until pads touch, pause for 1 second, resist weight as legs open wide."]',
  'Exhale squeezing together, inhale opening.', '2-1-1-1', '3',
  '12-15', 60, '[{"mistake":"Allowing weights to slam on return","fix":"Control the wide eccentric stretch."}]',
  'Do not force wider starting pin than comfortable.', 'Pillow Squeeze Between Knees', 'Seated Hip Adduction Machine',
  'Copenhagen Adductor Plank', 'adductors, inner thigh, groin, machine', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('c4e0b8bf-f83e-4ff7-b75d-f3a1de11f77c', '062260f6-598a-4171-b655-8ac097049b1d', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'a976e5ac-a31d-47af-859c-875bdd4b369f', 'Copenhagen Adductor Plank', 'copenhagen-adductor-plank', 'Elite athletic bodyweight exercise for high-force adductor strength and groin resilience.',
  'Adductors', 'Obliques, Core, Glutes', 'Legs',
  'Bodyweight', 'Advanced', 'Isolation',
  'Side plank with top leg resting on bench and bottom leg hovering underneath, hold body in rigid straight line.', '["Lie in side plank with top foot/ankle resting on bench (knee height), bottom leg free underneath."]', '["Lift hips and hold body rigid using top inner thigh (adductor) and obliques, hold for target time."]',
  'Breathe steadily throughout isometric hold.', 'Isometric', '3',
  '20-30 sec / side', 60, '[{"mistake":"Hips sagging downward","fix":"Keep hips aligned straight between shoulders and ankle."}]',
  'Bend top knee and rest knee on bench to reduce difficulty if ankle lever is too intense.', 'Short Lever Copenhagen Plank (Knee on Bench)', 'Full Copenhagen Plank',
  'Dynamic Copenhagen Adductor Raises', 'adductors, copenhagen, groin prehab, athletic', 250, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('41ace624-2c07-4aa8-9e8a-7fa7eca7b25d', 'a976e5ac-a31d-47af-859c-875bdd4b369f', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '43f948f6-cddd-46ce-bc72-2abc189a61db', 'Cossack Squat', 'cossack-squat', 'Frontal plane deep single-leg squat stretching the adductor of the trailing leg while building lead leg strength.',
  'Adductors', 'Quadriceps, Glutes, Hamstrings', 'Legs',
  'Bodyweight', 'Intermediate', 'Squat',
  'Wide stance, squat down deep to one side while other leg remains straight with toes pointing up, stand and alternate.', '["Stand in very wide straddle stance (2x shoulder-width), chest tall."]', '["Squat deep onto right leg, keep right heel on floor, left leg straight with toes rotating up to ceiling, drive up and switch."]',
  'Inhale descending, exhale pushing up.', '3-1-1-0', '3',
  '8-10 / leg', 60, '[{"mistake":"Working heel lifting off floor","fix":"Only go as deep as ankle mobility allows heel to stay planted."}]',
  'Hold onto a rack or pole for balance when first practicing.', 'Lateral Lunge', 'Bodyweight Cossack Squat',
  'Kettlebell Goblet Cossack Squat', 'adductors, mobility, cossack, frontal plane', 310, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('48ff33b5-6c1c-4b8c-8c96-4a2c2e3ec2c1', '43f948f6-cddd-46ce-bc72-2abc189a61db', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '3522883a-0fe1-4902-9f89-80fff449c49f', 'Cable Hip Adduction', 'cable-hip-adduction', 'Standing cable movement pulling the leg across the midline against resistance.',
  'Adductors', 'Core, Balance', 'Legs',
  'Cable', 'Beginner', 'Isolation',
  'Attach ankle strap to low cable, stand sideways with working leg closer to tower, pull leg across midline, and return.', '["Attach strap to inside ankle, stand sideways 2 feet away from low pulley."]', '["Pull working leg inward across the front of supporting leg, squeeze inner thigh, return slowly."]',
  'Exhale pulling inward, inhale returning.', '2-1-1-1', '3',
  '12-15 / leg', 45, '[{"mistake":"Twisting hips","fix":"Keep hips square."}]',
  'Hold cable frame for balance.', 'Side Lying Adductor Leg Lift', 'Cable Hip Adduction',
  'Cable Adduction with 2s Squeeze', 'adductors, cable, inner thigh', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('840ee80c-930b-493e-8efc-1cf025090c48', '3522883a-0fe1-4902-9f89-80fff449c49f', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  'cc4d10a4-7e73-4f4b-b367-9cadd6ebbbed', 'Standing Cable Hip Abduction', 'standing-cable-hip-abduction', 'Standing cable kick-out targeting the gluteus medius and minimus for hip stability.',
  'Abductors', 'Glutes', 'Legs',
  'Cable', 'Beginner', 'Isolation',
  'Attach ankle strap to low pulley, stand sideways with working leg away from tower, kick leg outward, squeeze, and return.', '["Attach strap to outside ankle, stand holding machine frame with slight torso lean."]', '["Sweep leg outward to side leading with heel, squeeze outer hip at top, lower slowly across front."]',
  'Exhale lifting leg out, inhale returning.', '2-1-1-1', '3',
  '12-15 / leg', 45, '[{"mistake":"Leaning torso excessively sideways to throw leg up","fix":"Keep torso still and isolate the hip joint."}]',
  'Lead slightly with the heel to bias glute medius over TFL.', 'Side-Lying Leg Lift', 'Standing Cable Hip Abduction',
  'Cable Abduction on Incline Bench', 'abductors, glute medius, cables, outer hip', 210, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('07e5fa0c-86db-4304-9ddb-c48d9a7b97b1', 'cc4d10a4-7e73-4f4b-b367-9cadd6ebbbed', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '6eebb807-496e-4531-911d-934173796eab', 'Side-Lying Clamshell', 'side-lying-clamshell', 'Classic physical therapy and glute activation movement targeting the deep external rotators and gluteus medius.',
  'Abductors', 'Glutes', 'Legs',
  'Resistance Band', 'Beginner', 'Isolation',
  'Lie on side with knees bent at 90 degrees and feet touching, open top knee like a clamshell, hold 1s, and lower.', '["Lie on side with knees bent at 90 degrees, heels glued together, band above knees."]', '["Rotate top knee open toward ceiling keeping feet touching, squeeze outer glute, lower slowly."]',
  'Exhale opening knee, inhale closing.', '2-1-1-1', '3',
  '15-20 / side', 45, '[{"mistake":"Rolling pelvis backward during opening","fix":"Keep top hip stacked directly over bottom hip."}]',
  'Crucial activation drill for hip and knee alignment.', 'Bodyweight Clamshell', 'Banded Clamshell',
  'Elevated Feet Banded Clamshell', 'abductors, clamshell, prehab, bands', 180, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('2c6ddbbf-5ad6-44e9-92c0-a4d4881c7ec0', '6eebb807-496e-4531-911d-934173796eab', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '5435c619-d873-424d-ab94-acccb1e9f573', 'Lateral Band Walk', 'lateral-band-walk', 'Side-to-side stepping drill against resistance band tension for continuous outer hip engagement.',
  'Abductors', 'Glutes', 'Legs',
  'Resistance Band', 'Beginner', 'Isolation',
  'Place band around ankles or feet, quarter squat, step sideways keeping tension on band at all times.', '["Loop mini resistance band around forefeet or ankles, get into athletic quarter squat."]', '["Take step to the right leading with right foot, follow with left foot keeping band taut, repeat 15 steps, then reverse."]',
  'Breathe rhythmically.', '1-0-1-0', '3',
  '15 steps each direction', 45, '[{"mistake":"Toes turning outward","fix":"Keep feet parallel and pointing straight forward."}]',
  'Keep knees pushed out in line with toes.', 'Lateral Walk with Band Above Knees', 'Lateral Walk with Band Around Ankles',
  'Lateral Walk with Band Around Forefeet', 'abductors, band walk, glute medius, warmup', 220, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('60640fa6-1857-49bb-a25a-7898b3a59e93', '5435c619-d873-424d-ab94-acccb1e9f573', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Exercise" (
  "id", "name", "slug", "description", "primaryMuscle", "secondaryMuscles", "bodyPart",
  "equipment", "difficulty", "movementPattern", "instructions", "setupSteps", "executionSteps",
  "breathingInstructions", "tempo", "recommendedSets", "recommendedReps", "recommendedRestSec",
  "commonMistakes", "safetyTips", "beginnerAlternative", "intermediateAlternative", "advancedAlternative",
  "tags", "caloriesBurnPerHour", "isCustom"
) VALUES (
  '748ed7ff-3d15-4711-8347-87cde1239a66', 'Side-Lying Leg Raise', 'side-lying-leg-raise', 'Mat-based hip abduction movement developing outer hip endurance and control.',
  'Abductors', 'Glutes', 'Legs',
  'Bodyweight', 'Beginner', 'Isolation',
  'Lie on side with legs straight, raise top leg upward to 45 degrees leading with heel, squeeze, and lower.', '["Lie completely straight on side, rest head on bottom arm, top hand on floor in front for balance."]', '["Raise top leg smoothly upward, lead with heel with slight internal rotation, hold 1s, lower slowly."]',
  'Exhale raising leg, inhale lowering.', '2-1-1-1', '3',
  '15-20 / leg', 45, '[{"mistake":"Rotating toe up to ceiling (targets hip flexor)","fix":"Keep toe pointing horizontal or slightly downward."}]',
  'Do not raise leg higher than 45 degrees to avoid lower back involvement.', 'Bodyweight Side-Lying Leg Raise', 'Banded Side-Lying Leg Raise',
  'Ankle-Weighted Side Leg Raise', 'abductors, mat, bodyweight, hips', 190, false
) ON CONFLICT ("slug") DO UPDATE SET
  "description" = EXCLUDED."description",
  "setupSteps" = EXCLUDED."setupSteps",
  "executionSteps" = EXCLUDED."executionSteps",
  "commonMistakes" = EXCLUDED."commonMistakes";
INSERT INTO "ExerciseMedia" ("id", "exerciseId", "type", "url", "provider", "isPrimary") VALUES ('3b7e6ace-2578-4347-bd18-fe2a261930b9', '748ed7ff-3d15-4711-8347-87cde1239a66', 'VIDEO', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'EXTERNAL', true) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Workout" ("id", "name", "slug", "description", "category", "difficulty", "durationMinutes", "isTemplate", "isPublic", "tags")
VALUES ('775c6e7d-63ec-4d45-afc5-98c67b36d5bb', 'Push Day (Chest, Shoulders & Triceps)', 'push-day-hypertrophy', 'High-intensity pushing session maximizing mechanical tension on pectorals, anterior deltoids, and triceps.', 'push_pull_legs', 'Intermediate', 50, true, true, 'chest, shoulders, triceps, push, ppl')
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('5fbaa203-5351-4145-b1e8-7caefadd020b', '775c6e7d-63ec-4d45-afc5-98c67b36d5bb', '34c6ba28-52e8-49dc-bdc6-b7f2f80e4bd9', 0, 4, '6-8', 120, '3-1-1-0', 'Primary compound press. Warm up thoroughly.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('c4471573-44f8-4ee5-af59-cf82e4851377', '775c6e7d-63ec-4d45-afc5-98c67b36d5bb', 'ee84a506-0065-4a7d-a0e4-675f3e8244b2', 1, 3, '8-10', 90, '2-0-1-0', 'Vertical pressing volume.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('74898c2d-c227-4c6f-b4b6-3ddb2f870717', '775c6e7d-63ec-4d45-afc5-98c67b36d5bb', '9ce4e734-947f-4394-bb34-7efe16220708', 2, 3, '12-15', 60, '2-0-1-1', 'Spread rope ends at lockout.') ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Workout" ("id", "name", "slug", "description", "category", "difficulty", "durationMinutes", "isTemplate", "isPublic", "tags")
VALUES ('d00f5c36-087e-4eb9-bfc4-9a890f2c5a1c', 'Pull Day (Back, Rear Delts & Biceps)', 'pull-day-hypertrophy', 'Complete pulling routine targeting lat width, upper back thickness, and peak bicep recruitment.', 'push_pull_legs', 'Intermediate', 50, true, true, 'back, biceps, pull, lats, ppl')
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('4b155483-d48f-4fd5-811a-17fe1c67cbb8', 'd00f5c36-087e-4eb9-bfc4-9a890f2c5a1c', 'd454eb4f-c05d-403b-bd95-a8904c7fe41d', 0, 3, '5', 180, '2-0-1-0', 'Heavy posterior chain pull.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('9b6f682b-7a4c-4f22-9c35-36b6923478f4', 'd00f5c36-087e-4eb9-bfc4-9a890f2c5a1c', 'de656105-0f2b-4a7c-ad8b-5790c1430faf', 1, 4, '8-10', 90, '2-1-1-0', 'Pull bar to navel.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('a60f7475-9a45-4b78-b39c-2562f63c1d4b', 'd00f5c36-087e-4eb9-bfc4-9a890f2c5a1c', '03381b92-41d3-43fb-a70f-e3728e53c5e1', 2, 3, '10-12', 75, '2-1-1-0', 'Squeeze lats at bottom.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('44a16606-ebac-4034-8978-29bba5699d2d', 'd00f5c36-087e-4eb9-bfc4-9a890f2c5a1c', '89f7d659-870e-4dce-a42c-101ebc4ed388', 3, 3, '10-12', 60, '2-0-1-0', 'Strict form, no hip swing.') ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Workout" ("id", "name", "slug", "description", "category", "difficulty", "durationMinutes", "isTemplate", "isPublic", "tags")
VALUES ('97045dc7-0e2d-4014-99e9-5780dbec0e77', 'Legs & Core Blast', 'legs-core-blast', 'Comprehensive lower body workout developing quadriceps, hamstrings, glutes, and core bracing.', 'push_pull_legs', 'Intermediate', 55, true, true, 'legs, quads, hamstrings, glutes, calves')
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('f48f2b1b-18bb-4cc8-a29e-c1c43299c373', '97045dc7-0e2d-4014-99e9-5780dbec0e77', 'c75f62eb-daef-4391-a337-092138e51986', 0, 4, '6-8', 150, '3-1-1-0', 'Full depth below parallel.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('659720c4-549e-4d43-9daa-68f958c65d6a', '97045dc7-0e2d-4014-99e9-5780dbec0e77', '5096b5a1-8e03-4cfa-9a4d-fa1af5581850', 1, 3, '8-10', 120, '3-1-1-0', 'Deep hamstring stretch.') ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Workout" ("id", "name", "slug", "description", "category", "difficulty", "durationMinutes", "isTemplate", "isPublic", "tags")
VALUES ('999ac869-dfc1-4d61-a9c1-f902bfc8abce', '5x5 Strength Foundation (Workout A)', '5x5-strength-workout-a', 'Classic linear progression protocol building raw fundamental strength across the big 3 lifts.', 'strength_5x5', 'Beginner', 45, true, true, '5x5, strength, barbell, basic')
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('24ee9068-03f0-47c1-833f-da244ad81c0a', '999ac869-dfc1-4d61-a9c1-f902bfc8abce', 'c75f62eb-daef-4391-a337-092138e51986', 0, 5, '5', 180, '2-1-1-0', 'Linear progression.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('e5696e92-4401-4bcf-a13f-3f2f29a3b5e4', '999ac869-dfc1-4d61-a9c1-f902bfc8abce', '34c6ba28-52e8-49dc-bdc6-b7f2f80e4bd9', 1, 5, '5', 180, '2-1-1-0', 'Focus on bar speed.') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "WorkoutExercise" ("id", "workoutId", "exerciseId", "orderIndex", "targetSets", "targetReps", "targetRestSec", "tempo", "notes") VALUES ('d6dec920-174d-4414-9fac-25b1e2f00030', '999ac869-dfc1-4d61-a9c1-f902bfc8abce', 'de656105-0f2b-4a7c-ad8b-5790c1430faf', 2, 5, '5', 120, '2-0-1-0', 'Explosive pull.') ON CONFLICT ("id") DO NOTHING;

-- ==========================================================
-- 4. SEED ADMIN & DEMO USER ACCOUNTS
-- ==========================================================
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "fitnessGoal", "experienceLevel", "xp", "level", "streakDays")
VALUES 
  ('admin-seed-id', 'admin@fitai.app', '$2a$10$tZ26fJtU0uB5XGzC07HjmeB8aU64d1vB78lG.3p8yNqmFq21oT7K6', 'Admin Master', 'ADMIN', 'muscle_building', 'advanced', 1250, 4, 12),
  ('user-demo-id', 'user@fitai.app', '$2a$10$Y1sL9mG1f1Zt4eN0z5eEkuV1c6L9iB5d4rF3mX8jA2gQ7sH9vK3p2', 'Alex Mercer', 'USER', 'muscle_building', 'intermediate', 450, 2, 5)
ON CONFLICT ("email") DO NOTHING;

