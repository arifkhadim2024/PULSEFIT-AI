import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const data = await req.json();

    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        primaryMuscle: data.primaryMuscle,
        secondaryMuscles: data.secondaryMuscles,
        bodyPart: data.bodyPart,
        equipment: data.equipment,
        difficulty: data.difficulty,
        movementPattern: data.movementPattern,
        instructions: data.instructions,
        setupSteps: typeof data.setupSteps === 'string' ? data.setupSteps : JSON.stringify(data.setupSteps || []),
        executionSteps: typeof data.executionSteps === 'string' ? data.executionSteps : JSON.stringify(data.executionSteps || []),
        breathingInstructions: data.breathingInstructions,
        tempo: data.tempo,
        recommendedSets: data.recommendedSets,
        recommendedReps: data.recommendedReps,
        recommendedRestSec: parseInt(data.recommendedRestSec, 10) || 60,
        commonMistakes: typeof data.commonMistakes === 'string' ? data.commonMistakes : JSON.stringify(data.commonMistakes || []),
        safetyTips: data.safetyTips,
        beginnerAlternative: data.beginnerAlternative,
        intermediateAlternative: data.intermediateAlternative,
        advancedAlternative: data.advancedAlternative,
        tags: data.tags,
      },
    });

    if (data.mediaUrl) {
      await prisma.exerciseMedia.upsert({
        where: { id: data.mediaId || 'temp' },
        create: {
          exerciseId: id,
          type: data.mediaType || 'VIDEO',
          url: data.mediaUrl,
          thumbnail: data.thumbnailUrl || null,
          provider: data.mediaProvider || 'UPLOAD',
          isPrimary: true,
        },
        update: {
          url: data.mediaUrl,
          thumbnail: data.thumbnailUrl || null,
          type: data.mediaType || 'VIDEO',
        },
      });
    }

    return NextResponse.json({ success: true, exercise });
  } catch (error) {
    console.error('Admin update exercise error:', error);
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;

    await prisma.exercise.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 });
  }
}
