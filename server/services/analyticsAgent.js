import { callOpenRouter }
from "./openrouter.js";

export const analyticsAgent =
  async (stats) => {
    const prompt = `
Analyze CRM data:

${JSON.stringify(stats)}

Generate:

3 Insights

2 Recommendations
`;

    return await callOpenRouter(
      prompt
    );
  };