import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculate1RM } from '@/lib/biomechanics';
import { calculateLevelFromXP } from '@/lib/gamification';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      workoutId,
      workoutName,
      durationMinutes,
      startedAt,
      completedAt,
      rating,
      notes,
      sets, // Array of { exerciseId, exerciseName, setNumber, weightKg, reps, rpe, completed }
    } = await req.json();

    if (!sets || !Array.isArray(sets) || sets.length === 0) {
      return NextResponse.json({ error: 'No workout sets provided' }, { status: 400 });
    }

    let totalVolumeKg = 0;
    let totalReps = 0;
    let completedSetsCount = 0;
    const newPrsDetected: any[] = [];

    // Check PRs for each completed set
    const processedSets: any[] = [];

    for (const set of sets) {
      if (!set.completed) continue;

      const weight = parseFloat(set.weightKg) || 0;
      const reps = parseInt(set.reps, 10) || 0;
      const volume = weight * reps;
      totalVolumeKg += volume;
      totalReps += reps;
      completedSetsCount++;

      let isPR = false;

      if (weight > 0 && reps > 0) {
        // Fetch existing heaviest weight PR
        const existingWeightPR = await prisma.personalRecord.findFirst({
          where: {
            userId: user.id,
            exerciseId: set.exerciseId,
            recordType: 'HEAVIEST_WEIGHT',
          },
          orderBy: { value: 'desc' },
        });

        if (!existingWeightPR || weight > existingWeightPR.value) {
          isPR = true;
          const prRecord = await prisma.personalRecord.create({
            data: {
              userId: user.id,
              exerciseId: set.exerciseId,
              exerciseName: set.exerciseName,
              recordType: 'HEAVIEST_WEIGHT',
              value: weight,
              repsAchieved: reps,
            },
          });
          newPrsDetected.push({
            exerciseName: set.exerciseName,
            type: 'Heaviest Weight',
            value: `${weight} kg for ${reps} reps`,
          });
        }

        // Calculate and check estimated 1RM PR
        const estimated1RM = calculate1RM(weight, reps).epley;
        const existing1RMPR = await prisma.personalRecord.findFirst({
          where: {
            userId: user.id,
            exerciseId: set.exerciseId,
            recordType: 'ESTIMATED_1RM',
          },
          orderBy: { value: 'desc' },
        });

        if (!existing1RMPR || estimated1RM > existing1RMPR.value) {
          await prisma.personalRecord.create({
            data: {
              userId: user.id,
              exerciseId: set.exerciseId,
              exerciseName: set.exerciseName,
              recordType: 'ESTIMATED_1RM',
              value: estimated1RM,
              repsAchieved: reps,
            },
          });
        }
      }

      processedSets.push({
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        setNumber: set.setNumber,
        weightKg: weight,
        reps,
        rpe: set.rpe ? parseFloat(set.rpe) : null,
        isPR,
        completed: true,
      });
    }

    // Calculate XP
    const baseXP = 100;
    const setsXP = completedSetsCount * 5;
    const prXP = newPrsDetected.length * 50;
    const totalXPEarned = baseXP + setsXP + prXP;

    // Save WorkoutLog
    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        workoutId: workoutId || null,
        workoutName: workoutName || 'Live Workout Session',
        startedAt: startedAt ? new Date(startedAt) : new Date(Date.now() - (durationMinutes || 30) * 60000),
        completedAt: completedAt ? new Date(completedAt) : new Date(),
        durationMinutes: parseInt(durationMinutes, 10) || 30,
        totalVolumeKg: Math.round(totalVolumeKg),
        totalSets: completedSetsCount,
        totalReps,
        rating: rating || 5,
        notes: notes || '',
        xpEarned: totalXPEarned,
        setLogs: {
          create: processedSets,
        },
      },
    });

    // Update User Streak & Level
    const updatedUserXp = user.xp + totalXPEarned;
    const { level } = calculateLevelFromXP(updatedUserXp);
    
    // Check streak
    let newStreak = user.streakDays;
    const lastDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: updatedUserXp,
        level,
        streakDays: newStreak,
        lastWorkoutDate: new Date(),
      },
    });

    // Check & Unlock Achievements
    const unlockedAchievements: any[] = [];
    const existingBadges = await prisma.achievement.findMany({
      where: { userId: user.id },
    });
    const existingBadgeKeys = new Set(existingBadges.map(b => b.badgeKey));

    // Badge 1: FIRST_WORKOUT
    if (!existingBadgeKeys.has('FIRST_WORKOUT')) {
      const badge = await prisma.achievement.create({
        data: {
          userId: user.id,
          badgeKey: 'FIRST_WORKOUT',
          title: 'First Step to Greatness',
          description: 'Completed your very first workout session in FitPulse.',
          icon: '🏆',
          category: 'milestone',
        },
      });
      unlockedAchievements.push(badge);
    }

    // Badge 2: FIRST_PR
    if (newPrsDetected.length > 0 && !existingBadgeKeys.has('FIRST_PR')) {
      const badge = await prisma.achievement.create({
        data: {
          userId: user.id,
          badgeKey: 'FIRST_PR',
          title: 'Breaking Boundaries',
          description: 'Set a new Personal Record on an exercise.',
          icon: '💥',
          category: 'strength',
        },
      });
      unlockedAchievements.push(badge);
    }

    // Badge 3: STREAK_7
    if (newStreak >= 7 && !existingBadgeKeys.has('STREAK_7')) {
      const badge = await prisma.achievement.create({
        data: {
          userId: user.id,
          badgeKey: 'STREAK_7',
          title: 'Iron Discipline',
          description: 'Maintained a 7-day workout streak without missing a beat.',
          icon: '⚡',
          category: 'streak',
        },
      });
      unlockedAchievements.push(badge);
    }

    return NextResponse.json({
      success: true,
      log: workoutLog,
      summary: {
        totalVolumeKg: Math.round(totalVolumeKg),
        totalSets: completedSetsCount,
        totalReps,
        durationMinutes: workoutLog.durationMinutes,
        xpEarned: totalXPEarned,
        newStreak,
        newLevel: level,
        prs: newPrsDetected,
        unlockedAchievements,
      },
    });
  } catch (error) {
    console.error('Error logging workout:', error);
    return NextResponse.json({ error: 'Failed to log workout' }, { status: 500 });
  }
}
