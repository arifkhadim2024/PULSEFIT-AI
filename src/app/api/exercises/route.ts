import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFallbackExercises } from '@/lib/exercises-data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const muscle = searchParams.get('muscle') || '';
    const equipment = searchParams.get('equipment') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const movement = searchParams.get('movement') || '';
    const bodyPart = searchParams.get('bodyPart') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '120', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { tags: { contains: search } },
          { primaryMuscle: { contains: search } },
        ];
      }

      if (status && status !== 'All') {
        where.verificationStatus = status;
      }

      if (muscle && muscle !== 'All') {
        where.primaryMuscle = muscle;
      }

      if (equipment && equipment !== 'All') {
        where.equipment = equipment;
      }

      if (difficulty && difficulty !== 'All') {
        where.difficulty = difficulty;
      }

      if (movement && movement !== 'All') {
        where.movementPattern = movement;
      }

      if (bodyPart && bodyPart !== 'All') {
        where.bodyPart = bodyPart;
      }

      const [total, exercises] = await Promise.all([
        prisma.exercise.count({ where }),
        prisma.exercise.findMany({
          where,
          take: limit,
          skip: offset,
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
          },
          orderBy: [
            { videoVerified: 'desc' },
            { name: 'asc' }
          ],
        }),
      ]);

      if (exercises && exercises.length > 0) {
        return NextResponse.json({
          total,
          exercises,
          limit,
          offset,
        });
      }
    } catch (dbError) {
      console.warn('DB exercise fetch failed, using fallback dataset:', dbError);
    }

    // High performance resilient fallback
    const fallbackResult = getFallbackExercises({
      search,
      status,
      muscle,
      equipment,
      difficulty,
      movement,
      bodyPart,
      limit,
      offset,
    });

    return NextResponse.json(fallbackResult);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    const fallback = getFallbackExercises();
    return NextResponse.json(fallback);
  }
}
