import { NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const input = await req.json();

    const program = await AIService.generateWorkout(input);

    return NextResponse.json({ success: true, program });
  } catch (error) {
    console.error('Error generating AI workout:', error);
    return NextResponse.json({ error: 'Failed to generate workout' }, { status: 500 });
  }
}
