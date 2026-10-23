---
recipe_version: 0.2.0
recipe_status: draft
extension_points:
  - id: prompts.system
    name: Scenario role, workflow, guardrails and greeting
  - id: scenario.data
    name: Local business knowledge and fixtures
  - id: api.routes
    name: Scenario routes and optional server-bound tools
  - id: pipeline.providers
    name: Managed speech, model, voice and turn detection
  - id: ui.conversation
    name: Scenario presentation and real session evidence
invariants:
  - id: tokens.rtc-rtm
    summary: Keep combined RTC and RTM token privileges and server-only certificates
  - id: lifecycle.strict-mode
    summary: Preserve the initialization guard and hook-owned cleanup
  - id: transcript.uid-remap
    summary: Remap local user UID zero and retain interrupted turns
  - id: scenario.outcome
    summary: Report business success only from the corresponding successful result
stable_contracts:
  - id: env.required
    summary: Use NEXT_PUBLIC_AGORA_APP_ID and server-only NEXT_AGORA_APP_CERTIFICATE in .env.local
  - id: api.token
    summary: GET /api/generate-agora-token returns token, uid and channel
  - id: api.invite-agent
    summary: Preserve this scenario's startup fields and server-bound tool scope
  - id: api.stop-conversation
    summary: POST /api/stop-conversation accepts agent_id
  - id: verification.canonical
    summary: pnpm run verify covers local contracts and build; Docker and live speech are separate
---

# Quickstart Recipe Profile

For the eight-part user guide, read [Service Feedback Survey](../../RECIPE.md).

## Recipe Role

- Role: `base` standalone scenario recipe, derived from the official Agora Next.js voice quickstart.
- Audience: developers running or integrating Service Feedback Survey.
- Reuse: inspect this source, configure the documented project, verify default conversation, then enable requested business tools.

## Recipe Scope

A considerate voice interviewer gathers feedback about a recent support experience: resolution, a 1–5 CSAT score, the reason, one improvement and explicit contact consent. It asks one question at a time and reviews the summary before any configured save.

Default conversation: The questionnaire and verbal review work without business tools. Answers are not saved and no follow-up is scheduled.

Optional tools: `save_survey_result` saves reviewed answers as local JSON. Complete results require resolution and a 1–5 rating; partial answers can be saved as abandoned with the user's agreement.

Limits: A follow-up flag records need, not permission or a scheduled callback. Ending the survey in the UI stops voice and does not save unsubmitted answers. There is no CRM write, refund or support-ticket update.

## Baseline Implementation Guidance

The upstream baseline is [AgoraIO-Conversational-AI/agent-quickstart-nextjs](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). This repository is its scenario derivative, not a replacement identity for upstream. Use current source and the [code map](L1/03_code_map.md); do not recreate SDK schemas, tokens or lifecycle from memory. [Bootstrap guidance](L1/L2/from_scratch_bootstrap.md) documents the copy map.

## Extension Points

| Surface | Source | Verification |
| --- | --- | --- |
| Interview and consent | `scenarios/03-customer-survey/config.ts` | pnpm run verify:scenario; verify the relevant acceptance case |
| Result schema and persistence | `scenarios/03-customer-survey/results.ts` | pnpm run verify:scenario; verify the relevant acceptance case |
| Presentation | `scenarios/03-customer-survey/presentation.ts` | pnpm run verify:scenario; verify the relevant acceptance case |

- `scenarios/index.ts`: default/tool prompt assembly.
- `scenarios/tool-contracts.ts`: available REST tools and parameter/call scope.
- `app/api/invite-agent/route.ts`: providers, turn detection and managed Agent lifecycle.
- `scenarios/presentation.ts` and scenario presentation: visible identity, start action and developer paths.
- `components/ScenarioInspector.tsx`, `lib/inspection.ts`: reported session evidence. Preserve missing values and manual outcome provenance.

## Invariants

- Keep `RtcTokenBuilder.buildTokenWithRtm` and the common Agent UID in `lib/agora.ts`.
- Preserve the StrictMode `isReady` guard and toolkit initialization after RTC join.
- Let `useJoin`, `useLocalMicrophoneTrack` and `usePublish` own leave, track cleanup and publication.
- Remap toolkit `uid="0"` to the local user; retain interrupted transcript turns.
- Keep certificates/provider keys on the server and business tools scoped to the appropriate call.
- Never infer a saved result from transcript text or replace failed tools with fixture success.
- A follow-up flag records need, not permission or a scheduled callback. Ending the survey in the UI stops voice and does not save unsubmitted answers. There is no CRM write, refund or support-ticket update.

## Stable Contracts

- `GET /api/generate-agora-token` returns `{ token, uid, channel }`.
- `POST /api/invite-agent` starts the scenario Agent. The invite body contains `requester_id` and `channel_name`; the server supplies the channel as survey `session_id`.
- `POST /api/stop-conversation` accepts `{ agent_id }`; already-stopping states are idempotent.
- `save_survey_result` calls `POST /api/scenarios/03-customer-survey/results` with `session_id`, `answers` and `status`. The invite supplies the RTC channel as the survey session ID. The first saved record for that session wins; retries return the existing result. `results.ts` derives the storage path; server route validation determines follow-up need.
- Local environment: `env.local.example` → `.env.local`; required keys are the public App ID and server-only App Certificate. [All variables](L1/01_setup.md) include optional business-tool/storage paths.
- Node.js 22+, pnpm 9.15.9; canonical checks are `pnpm run verify`. `pnpm run verify:docker` is a separate image/startup/scenario-route check.
- Use one Node process and a writable persistent directory for saved results. Set `TOP_TEN_DATA_DIR` to that directory; the default is `.scenario-data`. Ephemeral serverless disk does not provide durable survey storage. For multi-instance use, replace the local JSON store with shared storage.

## Internal / Subject To Change

Component layout, presentation copy, model/provider defaults, UI diagnostics and internal storage implementation are not stable external APIs. Inspect source rather than importing undocumented internals.

## Consumer Onboarding Recipe

1. Clone `https://github.com/littleDogWang/03-customer-survey.git` and change into `03-customer-survey`.
2. With Node.js 22+ and pnpm 9.15.9, run `pnpm install --frozen-lockfile`.
3. Copy `env.local.example` to `.env.local` only on a clean clone; fill the two Agora project credentials. Alternatively use the ready CLI's template-aware `agora quickstart env write . --template nextjs --project <your-project> --json`.
4. Run `pnpm run doctor`, then `pnpm run dev`. Open http://localhost:3000 and choose the scenario start action.
5. Verify two-way speech/transcript with a real call. The questionnaire and verbal review work without business tools. Answers are not saved and no follow-up is scheduled.
6. If requested, configure this same app's public HTTPS business-tool origin and start a fresh conversation; verify actual callbacks and result state.
7. Run `pnpm run verify`. For containers, follow [README Docker](../../README.md#docker) and run `pnpm run verify:docker`.
8. Customize only supported surfaces, synchronize this contract and the public guide, and repeat relevant checks. Repository edits do not register or publish a recipe automatically.
