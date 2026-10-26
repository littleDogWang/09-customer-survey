# Service Feedback Survey design

## Positioning

Scenario 03 belongs to AI Customer Service Agents: a short post-support service feedback interview. Its purpose is to learn whether the issue was resolved, understand the service rating and capture actionable improvements. It does not qualify sales leads.

## Interview

1. Explain the purpose and ask permission. Use a support experience supplied by the user; no real ticket is loaded.
2. Ask whether the issue was resolved: resolved, partially resolved or unresolved.
3. Ask for CSAT on an explicit 1–5 scale.
4. Branch on answers: low scores (1–2) prompt a reason; unresolved issues prompt what remains outstanding, including when the score is high. A resolved neutral experience prompts an improvement; a resolved positive experience prompts what worked well. Do not repeat a reason already given.
5. Ask for one optional improvement suggestion.
6. Ask separately for explicit contact consent. Do not infer consent from a low score. Accept optional comments naturally.
7. Read back the answers, accept corrections and ask for confirmation before saving. Submit completed only with known resolution and rating; otherwise abandoned. Never fabricate skipped answers.

Ask one question per turn. Brief interruptions resume at the next unanswered question. A spoken early-exit request stops questioning and offers to save confirmed partial answers as abandoned. Declining participation or declining to save produces no record.

The LLM history limit is 50 messages to retain answers across the longer interview and corrections. The prompt guides branching and review; this is not a deterministic questionnaire state machine. Real spoken acceptance is required to validate behavior.

## Data and tools

The existing results endpoint stores local JSON under `.scenario-data/03-customer-survey/results.json` or `TOP_TEN_DATA_DIR`. The save tool declares resolution, integer rating, reason category, free-text explanation, improvement and contact consent explicitly. The RTC channel is supplied to the Agent as the stable session_id. Retrying returns the first record without creating or replacing records.

The server derives needs_follow_up from unresolved/partially resolved issues, rating 1–2 or explicit contact willingness. Contact consent remains separate, including false or unknown. This flag records need; no contact is scheduled.

`TOP_TEN_SCENARIO_TOOL_BASE_URL` must point to this app at a public HTTPS address reachable by the managed Agent. Without it, the interview can run but cannot save; the prompt requires explaining this. Clicking the UI End survey button stops the session and does not reconstruct or save unsubmitted answers. Ask the Agent to review and save first. Persistent deployment needs a writable durable data directory; ephemeral/serverless disk is not durable storage.

## UI

Use the official starter entry card, transcript, layout and agora-agent-uikit visualizer/microphone controls with Tailwind 3 and the original HSL theme. Agent-ui adoption is paused. The entry and active header identify Service Feedback Survey and scenario 03, with task-specific actions and messages. The interview, save tool and result contract remain unchanged. Ask users to review/save with the Agent before clicking End survey.

## Boundaries and errors

No CRM, ticket lookup, callback scheduling, SMS or outbound calls. No simulated replies in production. Input errors return 400; persistence errors return 500 and never claim success. Do not swallow corrupted storage. No business action may be claimed without a successful configured tool response.
