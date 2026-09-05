import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const exercise = await prisma.exercise.findUnique({
      where: { slug },
      include: {
        media: true,
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    // Also fetch related exercises in same muscle group
    const related = await prisma.exercise.findMany({
      where: {
        primaryMuscle: exercise.primaryMuscle,
        id: { not: exercise.id },
      },
      take: 4,
      include: {
        media: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      exercise,
      related,
    });
  } catch (error) {
    console.error('Error fetching exercise detail:', error);
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 });
  }
}
