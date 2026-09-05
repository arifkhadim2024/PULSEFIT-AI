import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = {
      OR: [
        { isTemplate: true },
        ...(user ? [{ userId: user.id }] : []),
      ],
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                media: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category, difficulty, durationMinutes, exercises } = await req.json();

    if (!name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ error: 'Workout name and at least one exercise required' }, { status: 400 });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        name,
        slug,
        description: description || 'Custom user workout routine.',
        category: category || 'custom',
        difficulty: difficulty || 'Intermediate',
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        isTemplate: false,
        isPublic: false,
        exercises: {
          create: exercises.map((item: any, idx: number) => ({
            exerciseId: item.exerciseId,
            orderIndex: idx,
            targetSets: parseInt(item.targetSets, 10) || 3,
            targetReps: item.targetReps || '8-12',
            targetRestSec: parseInt(item.targetRestSec, 10) || 90,
            tempo: item.tempo || '3-0-1-0',
            notes: item.notes || '',
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    return NextResponse.json({ success: true, workout });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}
