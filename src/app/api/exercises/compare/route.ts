import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug1 = searchParams.get('slug1');
    const slug2 = searchParams.get('slug2');

    if (!slug1 || !slug2) {
      return NextResponse.json({ error: 'Please provide slug1 and slug2' }, { status: 400 });
    }

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

    if (!exercise1 || !exercise2) {
      return NextResponse.json({ error: 'One or both exercises could not be found' }, { status: 404 });
    }

    return NextResponse.json({ exercise1, exercise2 });
  } catch (error) {
    return NextResponse.json({ error: 'Comparison failed' }, { status: 500 });
  }
}
