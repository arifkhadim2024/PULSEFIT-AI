import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [
      totalUsers,
      totalExercises,
      totalWorkoutsLogged,
      totalPRs,
      recentUsers,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.exercise.count(),
      prisma.workoutLog.count(),
      prisma.personalRecord.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.workoutLog.findMany({
        take: 5,
        orderBy: { completedAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalExercises,
        totalWorkoutsLogged,
        totalPRs,
      },
      recentUsers,
      recentLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
