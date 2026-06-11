import { callOpenRouter }
from "./openrouter.js";

export const segmentAgent =
  async (goal) => {
    const prompt = `
You are a CRM Segmentation Agent.

Goal:
${goal}

Generate segmentation criteria.
`;

    return await callOpenRouter(
      prompt
    );
  };