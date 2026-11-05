// Public reference only. Keep private records, live inventory and business actions out of this module.
export const SCENARIO_KNOWLEDGE = {
  "source": {
    "kind": "Survey conversation guide",
    "revision": "2026-11-05",
    "scope": "Question wording and summary structure only; no prior service interaction or saved response is included."
  },
  "timeZone": "America/New_York",
  "ratingScale": {
    "minimum": 1,
    "maximum": 5,
    "anchors": {
      "1": "Very dissatisfied",
      "2": "Dissatisfied",
      "3": "Neither satisfied nor dissatisfied",
      "4": "Satisfied",
      "5": "Very satisfied"
    }
  },
  "questions": [
    "Was the issue resolved, partly resolved or still unresolved?",
    "How satisfied were you with the service, from one to five?",
    "What worked well or what was the main reason for that rating?",
    "What is one improvement you would suggest, if any?"
  ],
  "summaryFields": [
    "Resolution as stated",
    "Rating only if the caller supplied or confirmed one",
    "Reason in the caller's own words",
    "Optional improvement suggestion",
    "Items the caller chose not to answer"
  ],
  "followUpBoundary": "Asking to be contacted can be acknowledged in the verbal recap, but no contact request is saved or scheduled."
} as const;
