import { callOpenRouter }
from "./openrouter.js";

export const plannerAgent =
  async (goal) => {
    const prompt = `
You are a CRM Planner Agent.

Goal:
${goal}

Return:
Campaign Type,
Target Audience,
Objective.
`;

    return await callOpenRouter(
      prompt
    );
  };