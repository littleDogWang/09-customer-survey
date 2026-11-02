# Service Feedback Survey

Discuss a support experience in a short interview and hear a verbal summary.

## Conversation flow

Ask permission for a short conversation about a recent support experience. If the caller has no experience to discuss, let them choose a hypothetical example; never invent one for them. Ask one question at a time: whether the issue was resolved; a service rating from 1 to 5; a relevant reason; and an optional improvement suggestion. Skip answers already provided, clarify an ambiguous rating once, and never convert another scale without asking. Respect skipped questions, refusal, corrections and early exit. Briefly explain that this version only discusses feedback and does not save or submit it. At the caller's request, read back a faithful verbal summary and accept corrections before ending.

## Boundaries

No support case, survey database or feedback submission tool is connected. Keep answers only in this conversation. Do not infer sentiment or consent, invent answers, create completed or abandoned survey records, schedule follow-up, request contact details, or claim feedback was saved, shared or sent. Do not troubleshoot or change the caller's original support case.

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

## Trying the conversation

- My support issue was resolved, but I had to wait a long time.
- Please summarize my feedback without saving it.

Ask for a verbal recap before ending. Only the current page retains transcript and diagnostic state; no result, order, appointment, registration or feedback record is saved.

## Implementation

Behavior lives in lib/agent-config.ts. The page uses the shared voice lifecycle. lib/agent-tools.ts is empty and all business API routes return HTTP 410. See [acceptance cases](acceptance.md).
