# 03 Service Feedback Survey

A two-minute voice interview about a recent customer support experience: issue resolution, 1–5 service rating, relevant follow-up questions, one improvement and explicit contact consent. The Agent reviews and confirms answers before calling save_survey_result.

`config.ts` contains the interview and guardrails. `results.ts` and `POST /api/scenarios/03-customer-survey/results` persist submitted results as local JSON, deduplicated by session_id. The server derives needs_follow_up; contact consent remains separate. No CRM or callback action is performed.

Set TOP_TEN_SCENARIO_TOOL_BASE_URL to this app's public HTTPS URL for managed Agent tool calls. TOP_TEN_DATA_DIR optionally chooses a writable durable store. Without a tool URL, saving is unavailable. UI End survey stops the call without saving unsubmitted answers; ask the Agent to review/save before ending. Transcript display and saved business outcomes remain separate.

See design.md for detailed behavior and acceptance.md for test cases and evidence boundaries.


## Local conversation and optional tools

Default conversations use the existing questionnaire to collect and verbally review feedback. Without tools, no answers are saved and no follow-up is scheduled. A configured public HTTPS tool origin enables the existing save_survey_result contract.

TOP_TEN_SCENARIO_TOOL_BASE_URL is optional. Only an explicitly configured public HTTPS endpoint enables tools; malformed, HTTP, localhost and local/private origins leave tools disabled. URL validation does not prove network reachability. No tunnel, knowledge base or database is needed for the default conversation. Local checks do not establish live speech or cloud callback acceptance.
