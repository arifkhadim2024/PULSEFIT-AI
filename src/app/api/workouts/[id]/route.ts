import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const workout = await prisma.workout.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                media: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ workout });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}
