# Service Feedback Survey Architecture

## System Overview

A considerate voice interviewer gathers feedback about a recent support experience: resolution, a 1–5 CSAT score, the reason, one improvement and explicit contact consent. It asks one question at a time and reviews the summary before any configured save.

One Next.js process owns the browser application and its HTTP routes. Agora cloud owns the managed STT → LLM → TTS pipeline; the browser is not a local speech/model runtime. The default provider configuration is recorded in the invite route and `scenarios/runtime-profile.ts`.

## Component Topology

```text
Browser microphone <-> Agora RTC <-> managed Agent
Browser transcript <- Agora RTM <- managed Agent
Browser -- HTTPS --> Next.js token / invite / stop routes
Agent -- optional public HTTPS --> same Next.js scenario routes
Scenario routes -> single-process local file store
```

## Request And Event Flow

1. The user's start action bootstraps scenario state when needed, then fetches a combined RTC/RTM token.
2. The browser logs into/subscribes to RTM and invites the managed Agent. The invite body contains `requester_id` and `channel_name`; the server supplies the channel as survey `session_id`.
3. RTC hooks join and publish the microphone after the StrictMode guard; the toolkit binds both transports.
4. Audio travels over RTC. Transcript, Agent state, errors and reported latency travel over RTM.
5. `save_survey_result` calls `POST /api/scenarios/03-customer-survey/results` with `session_id`, `answers` and `status`. The invite supplies the RTC channel as the survey session ID. The first saved record for that session wins; retries return the existing result. `results.ts` derives the storage path; server route validation determines follow-up need.
6. Renewal keeps the joined RTC UID, RTM login UID and channel consistent.
7. Ending stops the Agent, logs out RTM and unmounts hook-owned RTC/microphone resources. Retained evidence is not itself a saved business result.

## Ownership Boundaries

- `components/LandingPage.tsx`: browser startup, RTM bootstrap, renewal and end orchestration.
- `components/ConversationComponent.tsx`: RTC/microphone hooks, toolkit events and transcript snapshots.
- `app/api/generate-agora-token/route.ts`: RTM-capable token creation.
- `app/api/invite-agent/route.ts`: privileged Agent configuration and startup.
- `scenarios/03-customer-survey/`: source of truth for scenario-specific rules and data.
- `scenarios/tool-contracts.ts`: available tools, parameter schemas and server-bound call scope.
- `lib/conversation.ts`: transcript UID/text normalization.

## Authentication And Secrets

The App Certificate stays in the Next.js server environment. Tokens are scoped/expiring; the browser receives tokens rather than the certificate. The public App ID is embedded into the client build and must match the server's project. Sample endpoints do not implement production user authentication. Business capabilities/session IDs limit example scope where implemented; they are not real customer/patient identity verification.

## Runtime Modes

Local development runs one Next.js process at http://localhost:3000 using `.env.local`. Native production uses `pnpm run build` then `pnpm run start`. Docker runs the same app as non-root UID 1001 on port 3000, without a reverse proxy inside the image. Use one Node process and a writable persistent directory for saved results. Set `TOP_TEN_DATA_DIR` to that directory; the default is `.scenario-data`. Ephemeral serverless disk does not provide durable survey storage. For multi-instance use, replace the local JSON store with shared storage.

```bash
docker build --build-arg NEXT_PUBLIC_AGORA_APP_ID=YOUR_AGORA_APP_ID -t 03-customer-survey:local .
docker run --rm -p 3000:3000 --env-file .env.local --mount source=03-customer-survey-data,target=/app/.scenario-data 03-customer-survey:local
```

Replace `YOUR_AGORA_APP_ID` with the public App ID used in `.env.local`. Next.js embeds that identifier in the browser bundle, so changing projects requires rebuilding the image. The App Certificate is supplied only at container runtime. The named volume preserves the non-root-owned `.scenario-data` directory. Leave custom host storage variables unset inside Docker or map them to the mounted directory; a host absolute path is not automatically mounted.

`pnpm run verify:docker` independently builds the image with synthetic credentials, starts an isolated localhost-bound container, checks the home page and a scenario route, then removes only that container. It does not contact Agora or prove a live voice session.

## API And External Contracts

The invite body contains `requester_id` and `channel_name`; the server supplies the channel as survey `session_id`.

The token route returns `{ token, uid, channel }`; stop accepts `{ agent_id }` and handles an already-stopping session idempotently. The questionnaire and verbal review work without business tools. Answers are not saved and no follow-up is scheduled. `save_survey_result` saves reviewed answers as local JSON. Complete results require resolution and a 1–5 rating; partial answers can be saved as abandoned with the user's agreement.

See [Interfaces](docs/ai/L1/06_interfaces.md), [internal recipe](docs/ai/RECIPE.md) and [scenario guide](scenarios/03-customer-survey/README.md) for contracts. Static checks, native startup, Docker startup and complete live speech/tool outcomes are separate evidence.
