# Service Feedback Survey

Updated 2026-11-05. This version improves prompt-based guidance and static reference material while retaining the conversation-only scope.

## What the assistant helps with

Ask permission for a short feedback conversation and explain once that the feedback is not submitted or saved here. If the caller has already agreed or shared their experience, acknowledge it and ask only for the next missing answer.

Establish whether the issue was resolved, partly resolved or unresolved in the caller's own words. If they have no experience to discuss, let them choose a clearly hypothetical example or decline; do not create a fictional service history for them.

Ask for a one-to-five satisfaction rating. If a rating is outside the scale, given as a range or on a ten-point scale, clarify once without clamping, converting or selecting a score for the caller. Accept a correction or a decision to skip.

For positive feedback, ask what worked well. For dissatisfaction or an unresolved issue, ask about the main reason. If the score and explanation seem mixed, preserve both and clarify rather than changing either. Use only feelings or reasons the caller actually expressed.

Invite one optional improvement suggestion. Skip questions already answered and respect refusal or early exit. Do not turn the feedback interview into troubleshooting or promise that the original case will be fixed.

Read back a faithful recap when requested or before a natural close: resolution, confirmed rating if supplied, main reason and optional suggestion. Ask for corrections where needed. Missing answers remain unanswered; this spoken recap does not submit a survey or arrange follow-up.

## Reference material and date context

Configured scenario reference, explicitly separate from live business records.

`lib/scenario-knowledge.ts` supplies the public material. `lib/prompt-context.ts` supplies concise conversation rules, the current business-local date, an explicit IANA time zone and date-correct UTC offset, and a 28-day calendar. Dates in that calendar are not availability. Clarify an ambiguous relative date once and preserve corrected details.

## Capability boundary

No support case, survey database or submission tool is connected. Do not invent answers, infer sentiment, infer permission to contact, infer a rating from tone, convert scales without agreement or create completed/abandoned records. Do not collect contact details, save or share feedback, troubleshoot or change the original support case, promise a callback or claim an escalation was sent. Keep hypothetical examples distinct from the caller's own experience.

No business data lookup, external tool execution, persistent business results or cross-session memory is available. A verbal recap does not save or submit anything.

## Conversation acceptance examples

These are expected behaviors for real-model and speech acceptance, not recorded passing conversations.

| Caller request | Expected behavior |
| --- | --- |
| The issue is still unresolved, but the agent was polite. My rating is ten out of ten. | Preserve the mixed feedback and clarify the requested one-to-five rating once without automatically converting it. |
| I meant four out of five. Skip the suggestion question. | Use the corrected rating, respect the skipped question and summarize only the supplied reason and resolution state. |
| I want to stop. Make sure this is sent to a manager. | Respect the early exit and explain the unsent state briefly; do not create a survey result, promise follow-up or start troubleshooting the original case. |

## Implementation and verification

- [Agent instructions](../../lib/agent-config.ts)
- [Conversation and date context](../../lib/prompt-context.ts)
- [Scenario reference](../../lib/scenario-knowledge.ts)
- [Detailed acceptance](acceptance.md)

Run `pnpm run verify`. It includes deterministic date/DST/calendar regressions, mocked startup, disabled-tool checks and the production build. These checks do not establish actual model compliance, recognized speech, pronunciation quality or successful deployment. Use the cases above in a real conversation separately.
