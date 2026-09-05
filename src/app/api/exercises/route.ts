import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
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
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({
      total,
      exercises,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}
