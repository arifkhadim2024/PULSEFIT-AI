import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFallbackExerciseBySlug } from '@/lib/exercises-data';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    try {
      const exercise = await prisma.exercise.findUnique({
        where: { slug },
        include: {
          media: true,
        },
      });

      if (exercise) {
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
      }
    } catch (dbError) {
      console.warn('DB exercise slug fetch failed, using fallback:', dbError);
    }

    // Fallback data
    const fallback = getFallbackExerciseBySlug(slug);
    if (!fallback) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(fallback);
  } catch (error) {
    console.error('Error fetching exercise detail:', error);
    const fallback = getFallbackExerciseBySlug(params.slug);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 });
  }
}
