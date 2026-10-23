# Scenario Agent Configuration

> Read when changing Service Feedback Survey's prompt, tools, provider chain or turn detection.

## Source Files

- `scenarios/03-customer-survey/config.ts`: role, workflow, guardrails and greeting.
- `scenarios/index.ts`: selected prompt and default/tool mode context.
- `scenarios/tool-contracts.ts`: optional tool origin validation, schemas and server-bound scope.
- `app/api/invite-agent/route.ts`: actual SDK builder and session options.
- `scenarios/runtime-profile.ts`: non-secret configured provider/model display.

There are no generic Ada/ADA_PROMPT constants to edit. Use the scenario config and prompt assembly actually imported by the invite route.

## Request And Startup

The invite body contains `requester_id` and `channel_name`; the server supplies the channel as survey `session_id`.

The server reads the App ID and App Certificate, builds AgoraClient with the selected area, and creates an Agent. The configured pipeline is Deepgram nova-3, OpenAI gpt-4o-mini and MiniMax speech_2_6_turbo. Copy the route's current builder pattern and createSession options; do not add an extra client argument or reproduce older SDK signatures.

The browser and invite route share DEFAULT_AGENT_UID. RTM, transcript/error delivery and metrics remain enabled. Session startup returns the Agent ID, creation timestamp and state; ending uses that same Agent ID.

## Prompt And Tools

Default behavior: The questionnaire and verbal review work without business tools. Answers are not saved and no follow-up is scheduled.

Tool behavior: `save_survey_result` saves reviewed answers as local JSON. Complete results require resolution and a 1–5 rating; partial answers can be saved as abandoned with the user's agreement.

`save_survey_result` calls `POST /api/scenarios/03-customer-survey/results` with `session_id`, `answers` and `status`. The invite supplies the RTC channel as the survey session ID. The first saved record for that session wins; retries return the existing result. `results.ts` derives the storage path; server route validation determines follow-up need.

A follow-up flag records need, not permission or a scheduled callback. Ending the survey in the UI stops voice and does not save unsubmitted answers. There is no CRM write, refund or support-ticket update.

## Provider And Turn Detection Changes

Edit the actual constructor blocks and turnDetection.config fields in the invite route. Provider BYOK examples are opt-in; keys stay server-side and are not part of the default two-key environment contract. For recruitment, preserve the configured 1,500 ms end-of-speech pause and 50-message LLM history unless intentionally changing interview pacing.

## Verification

Run `pnpm run verify:api`, `pnpm run verify:scenario` and canonical `pnpm run verify`. Real microphone pacing, interruptions and cloud HTTP execution require separate acceptance; mock Agent startup cannot establish those outcomes.

## See Also

- [Interfaces](../06_interfaces.md)
- [Workflows](../05_workflows.md)
- [Token model](token_model.md)
