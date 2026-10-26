import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getScenarioConfig, getScenarioPrompt } from '../lib/agent-config';
import { getScenarioTools } from '../lib/agent-tools';

async function main() {
  assert.equal(getScenarioConfig().id, '03-customer-survey');
  assert.ok(getScenarioPrompt().includes('# Goal and conversation flow'));
  assert.equal(getScenarioTools('03-customer-survey', '').length, 0);
  const tools = getScenarioTools('03-customer-survey', 'https://example.com/');
  assert.equal(tools[0].server?.url, 'https://example.com/api/scenarios/03-customer-survey/results');

  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'service-feedback-'));
  process.env.TOP_TEN_DATA_DIR = dataDir;
  try {
    const { POST } = await import('../app/api/scenarios/03-customer-survey/results/route');
    const submit = (body: unknown) => POST(new Request('http://localhost/api/scenarios/03-customer-survey/results', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }));
    const unhappy = {
      session_id: 'unresolved',
      answers: { issue_resolution: 'unresolved', satisfaction_rating: 2, dissatisfaction_reason: 'resolution', main_issue: 'The replacement still has not arrived.', improvement_suggestion: 'Give me a realistic delivery date.', willing_to_follow_up: false },
      status: 'completed',
    };
    const first = await submit(unhappy);
    assert.equal(first.status, 201);
    const saved = await first.json();
    assert.equal(saved.result.needs_follow_up, true);
    assert.equal(saved.result.answers.willing_to_follow_up, false, 'Need for follow-up must not overwrite contact refusal');
    assert.equal(saved.result.answers.satisfaction_rating, 2);
    assert.ok(!Number.isNaN(Date.parse(saved.result.created_at)));

    const duplicate = await submit({ ...unhappy, answers: { issue_resolution: 'resolved', satisfaction_rating: 5 } });
    assert.equal(duplicate.status, 200);
    const duplicateBody = await duplicate.json();
    assert.equal(duplicateBody.duplicate, true);
    assert.deepEqual(duplicateBody.result, saved.result, 'Retries must preserve the original record');

    for (const [id, answers, expectedNeed] of [
      ['happy', { issue_resolution: 'resolved', satisfaction_rating: 5 }, false],
      ['low-score', { issue_resolution: 'resolved', satisfaction_rating: 1 }, true],
      ['partial-resolution', { issue_resolution: 'partially_resolved', satisfaction_rating: 4 }, true],
      ['contact-request', { issue_resolution: 'resolved', satisfaction_rating: 5, willing_to_follow_up: true }, true],
    ] as const) {
      const response = await submit({ session_id: id, answers, status: 'completed', needs_follow_up: !expectedNeed });
      assert.equal(response.status, 201);
      assert.equal((await response.json()).result.needs_follow_up, expectedNeed, 'Server derives the flag from explicit answers');
    }

    const partial = await submit({ session_id: 'early-exit', answers: { issue_resolution: 'unresolved' }, status: 'abandoned' });
    assert.equal(partial.status, 201);
    const partialBody = await partial.json();
    assert.equal(partialBody.result.status, 'abandoned');
    assert.equal('satisfaction_rating' in partialBody.result.answers, false);
    assert.equal('willing_to_follow_up' in partialBody.result.answers, false, 'Skipped consent must remain unknown');

    for (const answers of [
      { issue_resolution: 'resolved', satisfaction_rating: 0 },
      { issue_resolution: 'resolved', satisfaction_rating: 6 },
      { issue_resolution: 'resolved', satisfaction_rating: 2.5 },
      { issue_resolution: 'resolved', satisfaction_rating: '2' },
      { issue_resolution: 'maybe', satisfaction_rating: 3 },
      { issue_resolution: ['resolved'], satisfaction_rating: 3 },
      { issue_resolution: 'resolved', satisfaction_rating: 3, dissatisfaction_reason: ['wait_time'] },
      { issue_resolution: 'resolved', satisfaction_rating: 3, willing_to_follow_up: 'false' },
      { issue_resolution: 'resolved', satisfaction_rating: 3, dissatisfaction_reason: 'invented' },
      { issue_resolution: 'resolved', satisfaction_rating: 3, main_issue: 1 },
      { issue_resolution: 'resolved', satisfaction_rating: 3, hidden_answer: true },
      { satisfaction_rating: 3 }, {}, [], null,
    ]) assert.equal((await submit({ session_id: 'bad', answers, status: 'completed' })).status, 400);
    for (const body of [null, [], { session_id: ' ', answers: {}, status: 'abandoned' }, { session_id: 'bad', answers: {}, status: 'unknown' }]) {
      assert.equal((await submit(body)).status, 400);
    }
    assert.equal((await POST(new Request('http://localhost/results', { method: 'POST', body: '{' }))).status, 400);

    const resultsFile = path.join(dataDir, '03-customer-survey', 'results.json');
    assert.equal(JSON.parse(fs.readFileSync(resultsFile, 'utf8')).length, 6);
    fs.writeFileSync(resultsFile, '{broken');
    assert.equal((await submit({ session_id: 'corrupt-store', answers: {}, status: 'abandoned' })).status, 500);
    assert.equal(fs.readFileSync(resultsFile, 'utf8'), '{broken', 'Corrupt storage must not be silently overwritten');
    fs.rmSync(resultsFile);
    fs.mkdirSync(resultsFile);
    assert.equal((await submit({ session_id: 'blocked-store', answers: {}, status: 'abandoned' })).status, 500);
    console.log('Scenario 03 contracts passed: branching answer fields, validation, consent, derived follow-up, partial results, deduplication and storage failures.');
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
    delete process.env.TOP_TEN_DATA_DIR;
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
