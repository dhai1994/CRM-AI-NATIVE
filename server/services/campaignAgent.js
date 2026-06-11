import { callOpenRouter }
from "./openrouter.js";

export const campaignAgent =
  async (goal) => {
    const prompt = `
You are a Marketing Agent.

Goal:
${goal}

Generate:

Campaign Name

Email Subject

Email Content

Expected Outcome
`;

    return await callOpenRouter(
      prompt
    );
  };