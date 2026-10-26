import { NextResponse } from 'next/server';
import {
  saveSurveyResult,
  type CustomerSurveyResult,
} from '@/lib/customer-survey/results';

function isAnswers(value: unknown): value is CustomerSurveyResult['answers'] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const answers = value as Record<string, unknown>;
  const allowed = ['issue_resolution', 'satisfaction_rating', 'dissatisfaction_reason', 'improvement_suggestion', 'satisfaction', 'main_issue', 'willing_to_follow_up', 'additional_comments'];
  if (Object.keys(answers).some(key => !allowed.includes(key))) return false;
  for (const key of ['improvement_suggestion', 'satisfaction', 'main_issue', 'additional_comments']) {
    if (answers[key] !== undefined && typeof answers[key] !== 'string') return false;
  }
  if (answers.issue_resolution !== undefined && (typeof answers.issue_resolution !== 'string' || !['resolved', 'partially_resolved', 'unresolved'].includes(answers.issue_resolution))) return false;
  if (answers.dissatisfaction_reason !== undefined && (typeof answers.dissatisfaction_reason !== 'string' || !['wait_time', 'resolution', 'communication', 'other'].includes(answers.dissatisfaction_reason))) return false;
  if (answers.satisfaction_rating !== undefined && (typeof answers.satisfaction_rating !== 'number' || !Number.isInteger(answers.satisfaction_rating) || answers.satisfaction_rating < 1 || answers.satisfaction_rating > 5)) return false;
  return answers.willing_to_follow_up === undefined || typeof answers.willing_to_follow_up === 'boolean';
}

export async function POST(request: Request) {
  let body: Partial<CustomerSurveyResult>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' ||
    typeof body.session_id !== 'string' || !body.session_id.trim() ||
    !isAnswers(body.answers) ||
    (body.status !== 'completed' && body.status !== 'abandoned')) {
    return NextResponse.json({ error: 'session_id, valid survey answers, and completed or abandoned status are required' }, { status: 400 });
  }
  if (body.status === 'completed' && (body.answers.issue_resolution === undefined || body.answers.satisfaction_rating === undefined)) {
    return NextResponse.json({ error: 'Completed surveys require issue_resolution and satisfaction_rating; save partial answers as abandoned' }, { status: 400 });
  }

  const answers = body.answers;
  const result: CustomerSurveyResult = {
    session_id: body.session_id.trim(),
    answers,
    status: body.status,
    needs_follow_up: answers.issue_resolution === 'unresolved' || answers.issue_resolution === 'partially_resolved' ||
      (answers.satisfaction_rating !== undefined && answers.satisfaction_rating <= 2) || answers.willing_to_follow_up === true,
    created_at: new Date().toISOString(),
  };
  try {
    const saved = saveSurveyResult(result);
    return NextResponse.json(saved, { status: saved.duplicate ? 200 : 201 });
  } catch (error) {
    console.error('Could not save service feedback:', error);
    return NextResponse.json({ error: 'Could not save feedback. Please retry with the same session_id.' }, { status: 500 });
  }
}
