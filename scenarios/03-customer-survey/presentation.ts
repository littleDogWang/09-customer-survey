import type { ScenarioPresentation } from '../presentation';

export const presentation: ScenarioPresentation = {
  "id": "03-customer-survey",
  "name": "Service Feedback Survey",
  "purpose": "Resolution, rating and feedback",
  "headline": [
    "Feedback, by voice."
  ],
  "summary": "Share whether your support issue was resolved, rate the service and suggest improvements.",
  "featuresHeading": "Beyond starter",
  "features": [
    {
      "emoji": "✅",
      "title": "Resolution check"
    },
    {
      "emoji": "⭐",
      "title": "1–5 service rating"
    },
    {
      "emoji": "📝",
      "title": "Review before saving"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start feedback survey",
  "boundaryShort": "Ask the assistant to review and save. Ending alone does not save unsubmitted answers.",
  "outcomes": [
    {
      "id": "shared",
      "label": "I shared my feedback"
    },
    {
      "id": "incomplete",
      "label": "I have more to share"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs",
    "runCommand": "pnpm install\nagora login\nagora project use <your-project>\nagora project env write .env.local\npnpm dev",
    "skillsCommand": "npx skills add github:AgoraIO/skills",
    "assistantPrompt": "Use Agora Skills to work in the existing 03-customer-survey scenario checkout. Preserve the working Agora session lifecycle and business contracts. Help me adapt its business data and assistant instructions for my workflow.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://www.npmjs.com/package/agora-agents",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "skillsUrl": "https://github.com/AgoraIO/skills",
    "extensionPoints": [
      {
        "title": "Change assistant instructions",
        "path": "scenarios/03-customer-survey/config.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "app/api/invite-agent/route.ts"
      },
      {
        "title": "Adapt scenario UI content",
        "path": "scenarios/03-customer-survey/presentation.ts"
      }
    ]
  }
};
