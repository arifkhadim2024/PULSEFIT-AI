import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const exercises = await prisma.exercise.findMany({
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await req.json();

    if (!data.name || !data.primaryMuscle || !data.equipment) {
      return NextResponse.json({ error: 'Name, Primary Muscle, and Equipment are required' }, { status: 400 });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const exercise = await prisma.exercise.create({
      data: {
        name: data.name,
        slug,
        description: data.description || 'Gym exercise.',
        primaryMuscle: data.primaryMuscle,
        secondaryMuscles: data.secondaryMuscles || '',
        bodyPart: data.bodyPart || 'Full Body',
        equipment: data.equipment,
        difficulty: data.difficulty || 'Intermediate',
        movementPattern: data.movementPattern || 'Isolation',
        instructions: data.instructions || '',
        setupSteps: typeof data.setupSteps === 'string' ? data.setupSteps : JSON.stringify(data.setupSteps || []),
        executionSteps: typeof data.executionSteps === 'string' ? data.executionSteps : JSON.stringify(data.executionSteps || []),
        breathingInstructions: data.breathingInstructions || 'Breathe steadily.',
        tempo: data.tempo || '3-0-1-0',
        recommendedSets: data.recommendedSets || '3',
        recommendedReps: data.recommendedReps || '10-12',
        recommendedRestSec: parseInt(data.recommendedRestSec, 10) || 60,
        commonMistakes: typeof data.commonMistakes === 'string' ? data.commonMistakes : JSON.stringify(data.commonMistakes || []),
        safetyTips: data.safetyTips || 'Keep good form.',
        beginnerAlternative: data.beginnerAlternative || '',
        intermediateAlternative: data.intermediateAlternative || '',
        advancedAlternative: data.advancedAlternative || '',
        tags: data.tags || data.name.toLowerCase(),
        caloriesBurnPerHour: parseInt(data.caloriesBurnPerHour, 10) || 300,
        isCustom: true,
      },
    });

    if (data.mediaUrl) {
      await prisma.exerciseMedia.create({
        data: {
          exerciseId: exercise.id,
          type: data.mediaType || 'VIDEO',
          url: data.mediaUrl,
          thumbnail: data.thumbnailUrl || null,
          provider: data.mediaProvider || 'UPLOAD',
          isPrimary: true,
        },
      });
    }

    return NextResponse.json({ success: true, exercise });
  } catch (error) {
    console.error('Admin create exercise error:', error);
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}
