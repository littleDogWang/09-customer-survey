import { NextResponse } from 'next/server';
import {
  saveSurveyResult,
  type CustomerSurveyResult,
} from '@/scenarios/03-customer-survey/results';

function isAnswers(value: unknown): value is CustomerSurveyResult['answers'] {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CustomerSurveyResult>;
    if (
      typeof body.session_id !== 'string' ||
      !body.session_id.trim() ||
      !isAnswers(body.answers) ||
      (body.status !== 'completed' && body.status !== 'abandoned')
    ) {
      return NextResponse.json(
        { error: 'session_id, answers, and a valid status are required' },
        { status: 400 },
      );
    }

    const result: CustomerSurveyResult = {
      session_id: body.session_id.trim(),
      answers: body.answers,
      status: body.status,
      needs_follow_up: Boolean(body.needs_follow_up),
      created_at:
        typeof body.created_at === 'string'
          ? body.created_at
          : new Date().toISOString(),
    };
    const saved = saveSurveyResult(result);
    return NextResponse.json(saved, { status: saved.duplicate ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'invalid request' },
      { status: 400 },
    );
  }
}
