import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [logs, prs, measurements, achievements] = await Promise.all([
      prisma.workoutLog.findMany({
        where: { userId: user.id },
        include: {
          setLogs: true,
        },
        orderBy: { completedAt: 'desc' },
        take: 30,
      }),
      prisma.personalRecord.findMany({
        where: { userId: user.id },
        orderBy: { achievedAt: 'desc' },
      }),
      prisma.bodyMeasurement.findMany({
        where: { userId: user.id },
        orderBy: { recordedAt: 'asc' },
        take: 20,
      }),
      prisma.achievement.findMany({
        where: { userId: user.id },
        orderBy: { unlockedAt: 'desc' },
      }),
    ]);

    // Calculate aggregated metrics
    const totalWorkouts = logs.length;
    const totalVolumeTons = Math.round(logs.reduce((acc, log) => acc + log.totalVolumeKg, 0) / 1000 * 10) / 10;
    const totalSetsCompleted = logs.reduce((acc, log) => acc + log.totalSets, 0);
    const totalRepsCompleted = logs.reduce((acc, log) => acc + log.totalReps, 0);

    // Calculate muscle distribution
    const muscleCounts: Record<string, number> = {};
    for (const log of logs) {
      for (const set of log.setLogs) {
        // Find primary muscle for set if possible or map by name
        muscleCounts[set.exerciseName] = (muscleCounts[set.exerciseName] || 0) + 1;
      }
    }

    return NextResponse.json({
      summary: {
        totalWorkouts,
        totalVolumeTons,
        totalSetsCompleted,
        totalRepsCompleted,
        streakDays: user.streakDays,
        xp: user.xp,
        level: user.level,
      },
      logs,
      prs,
      measurements,
      achievements,
      muscleCounts,
    });
  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
