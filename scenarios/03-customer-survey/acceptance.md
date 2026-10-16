# Service Feedback Survey acceptance

## Spoken interview cases (require a real session)

1. Resolved, 5/5: ask what worked well, collect an optional improvement, ask contact consent, review and save.
2. Unresolved, 2/5: ask what remains outstanding and what drove the score without repeating the same reason; preserve explicit refusal of contact.
3. Unresolved, 5/5: still ask what remains outstanding; high satisfaction does not imply resolution.
4. User supplies resolution, score and reason together: ask only unanswered questions.
5. Invalid/ambiguous score: clarify the 1–5 scale; do not convert or guess.
6. Skip optional improvement or contact questions: leave fields absent; do not insert false or zero.
7. Correct a score during review: save only the corrected, confirmed result.
8. Spoken early exit: stop questions, request permission to save partial confirmed answers as abandoned.
9. Refuse interview or saving: no tool call.
10. Saving unavailable/fails: explain accurately, never claim success; retry only with permission and the same session_id.

## Automated checks

`pnpm run verify:scenario` uses a temporary store and covers completed and abandoned payloads; resolution/rating/reason types; score range; unknown fields; independent contact consent; server-derived follow-up; skipped fields; deduplication; invalid JSON; corrupt/unreadable storage returning 500 without data replacement.

`pnpm run verify` includes doctor, lint, typecheck, existing API tests, scenario contracts and build. These checks do not prove real Agent tool calls or conversational behavior.

## UI acceptance

Inspect the actual starter entry card, loading/error copy and active conversation at desktop/mobile viewports. Confirm visible scenario identity, readable content and no overflow. The starter visualizer, transcript, microphone and end controls must remain wired to real application state. Explicitly simulated component fixtures may validate layout; they do not establish microphone, RTC or cloud tool acceptance.

The End survey action does not save unsubmitted answers. Copy must ask users to let the Agent review/save first and must not imply that ending alone saved a result.
