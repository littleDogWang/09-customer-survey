import fs from 'node:fs';
import path from 'node:path';

export type SurveyStatus = 'completed' | 'abandoned';

export interface CustomerSurveyResult {
  session_id: string;
  answers: {
    issue_resolution?: 'resolved' | 'partially_resolved' | 'unresolved';
    satisfaction_rating?: number;
    dissatisfaction_reason?: 'wait_time' | 'resolution' | 'communication' | 'other';
    improvement_suggestion?: string;
    satisfaction?: string;
    main_issue?: string;
    willing_to_follow_up?: boolean;
    additional_comments?: string;
  };
  status: SurveyStatus;
  needs_follow_up: boolean;
  created_at: string;
}

const resultsFile = path.join(
  process.env.TOP_TEN_DATA_DIR ?? path.join(process.cwd(), '.scenario-data'),
  '03-customer-survey',
  'results.json',
);

function readResults(): Map<string, CustomerSurveyResult> {
  try {
    const contents = fs.readFileSync(resultsFile, 'utf8');
    const records = JSON.parse(contents) as CustomerSurveyResult[];
    return new Map(records.map((record) => [record.session_id, record]));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return new Map();
    throw error;
  }
}

function writeResults(results: Map<string, CustomerSurveyResult>): void {
  fs.mkdirSync(path.dirname(resultsFile), { recursive: true });
  fs.writeFileSync(
    resultsFile,
    JSON.stringify([...results.values()], null, 2) + '\n',
    'utf8',
  );
}

export function saveSurveyResult(result: CustomerSurveyResult): {
  result: CustomerSurveyResult;
  duplicate: boolean;
} {
  const results = readResults();
  const existing = results.get(result.session_id);
  if (existing) return { result: existing, duplicate: true };

  results.set(result.session_id, result);
  writeResults(results);
  return { result, duplicate: false };
}
