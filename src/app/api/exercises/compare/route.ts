import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFallbackExerciseBySlug } from '@/lib/exercises-data';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug1 = searchParams.get('slug1');
    const slug2 = searchParams.get('slug2');

    if (!slug1 || !slug2) {
      return NextResponse.json({ error: 'Please provide slug1 and slug2' }, { status: 400 });
    }

    try {
      const [exercise1, exercise2] = await Promise.all([
        prisma.exercise.findUnique({
          where: { slug: slug1 },
          include: { media: true },
        }),
        prisma.exercise.findUnique({
          where: { slug: slug2 },
          include: { media: true },
        }),
      ]);

      if (exercise1 && exercise2) {
        return NextResponse.json({ exercise1, exercise2 });
      }
    } catch (dbError) {
      console.warn('DB compare fetch failed, using fallback:', dbError);
    }

    const ex1 = getFallbackExerciseBySlug(slug1)?.exercise;
    const ex2 = getFallbackExerciseBySlug(slug2)?.exercise;

    if (!ex1 || !ex2) {
      return NextResponse.json({ error: 'One or both exercises could not be found' }, { status: 404 });
    }

    return NextResponse.json({ exercise1: ex1, exercise2: ex2 });
  } catch (error) {
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
  }
}
