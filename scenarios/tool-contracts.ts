import type { LlmTool } from 'agora-agents';
type Property = Record<string, unknown>;
function tool(baseUrl: string, name: string, description: string, method: 'GET' | 'POST', path: string, properties: Property, required: string[], body?: Record<string, unknown>): LlmTool {
  return { type: 'function', function: { name, description, parameters: { type: 'object', properties, required } }, server: { method, url: `${baseUrl.replace(/\/$/, '')}${path}`, ...(body ? { body } : {}) } };
}
export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): LlmTool[] {
  if (!baseUrl) return [];
  const stringProperty = { type: 'string' };
  const integerProperty = { type: 'integer' };
  return [
        tool(baseUrl, 'save_survey_result', 'Save a completed or abandoned customer survey result.', 'POST', '/api/scenarios/03-customer-survey/results', { session_id: stringProperty, answers: { type: 'object' }, status: { type: 'string', enum: ['completed', 'abandoned'] }, needs_follow_up: { type: 'boolean' } }, ['session_id', 'answers', 'status'], { session_id: '{{args.session_id}}', answers: '{{args.answers}}', status: '{{args.status}}', needs_follow_up: '{{args.needs_follow_up}}' }),
      ];
}
