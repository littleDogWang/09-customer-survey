import type { LlmTool } from 'agora-agents';

export function getToolBaseUrl(value = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    const localHost = (!host.includes('.') && !host.startsWith('[')) || /(^|\.)(localhost|local|internal)$/.test(host) ||
      /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(host) ||
      /^(\[::|\[f[cd]|\[fe[89ab])/.test(host);
    if (url.protocol !== 'https:' || localHost || url.username || url.password || url.search || url.hash) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): LlmTool[] {
  const origin = getToolBaseUrl(baseUrl);
  if (!origin) return [];
  return [{
    type: 'function',
    function: {
      name: 'save_survey_result',
      description: 'Save confirmed service feedback after the user reviews the summary, or consents to saving partial answers on a spoken early exit. Use the session_id from session context. A saved follow-up flag does not schedule contact.',
      parameters: {
        type: 'object',
        properties: {
          session_id: { type: 'string', description: 'The exact session_id provided in session context; reuse for retries.' },
          answers: {
            type: 'object',
            additionalProperties: false,
            properties: {
              issue_resolution: { type: 'string', enum: ['resolved', 'partially_resolved', 'unresolved'] },
              satisfaction_rating: { type: 'integer', minimum: 1, maximum: 5 },
              dissatisfaction_reason: { type: 'string', enum: ['wait_time', 'resolution', 'communication', 'other'] },
              main_issue: { type: 'string', description: 'The user’s reason, unresolved issue or positive feedback, in their own words.' },
              improvement_suggestion: { type: 'string' },
              willing_to_follow_up: { type: 'boolean', description: 'Explicit contact consent only. Omit when skipped or unknown.' },
              additional_comments: { type: 'string' },
            },
          },
          status: { type: 'string', enum: ['completed', 'abandoned'], description: 'Completed requires resolution, rating and confirmed review; otherwise abandoned.' },
        },
        required: ['session_id', 'answers', 'status'],
      },
    },
    server: {
      method: 'POST',
      url: `${origin}/api/scenarios/09-customer-survey/results`,
      body: { session_id: '{{args.session_id}}', answers: '{{args.answers}}', status: '{{args.status}}' },
    },
  }];
}
