import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { weightKg, chestCm, waistCm, armsCm, thighsCm, shouldersCm, calvesCm, notes } = await req.json();

    const measurement = await prisma.bodyMeasurement.create({
      data: {
        userId: user.id,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        chestCm: chestCm ? parseFloat(chestCm) : null,
        waistCm: waistCm ? parseFloat(waistCm) : null,
        armsCm: armsCm ? parseFloat(armsCm) : null,
        thighsCm: thighsCm ? parseFloat(thighsCm) : null,
        shouldersCm: shouldersCm ? parseFloat(shouldersCm) : null,
        calvesCm: calvesCm ? parseFloat(calvesCm) : null,
        notes: notes || '',
      },
    });

    if (weightKg) {
      await prisma.user.update({
        where: { id: user.id },
        data: { weightKg: parseFloat(weightKg) },
      });
    }

    return NextResponse.json({ success: true, measurement });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record measurement' }, { status: 500 });
  }
}
