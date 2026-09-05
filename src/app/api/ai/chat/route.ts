import { NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const user = await getCurrentUser();
    const result = await AIService.answerFitnessQuestion(question, user);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({
      answer: 'I am currently processing training data. Please ask again in a moment!',
      isMedicalWarning: false,
    });
  }
}
