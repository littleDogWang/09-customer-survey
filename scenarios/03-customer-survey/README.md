# 03 Customer survey

`config.ts` defines the question flow. `results.ts` and the results API save
completed or abandoned answers as local JSON under `.scenario-data/` and dedupe
retries by `session_id`. Transcript evidence and the structured result remain
separate.
