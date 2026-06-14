import Customer from "../models/Customer.js";
import { callOpenRouter } from "../services/openrouter.js";

export const askCopilot = async (req, res) => {
  try {
    const { message } = req.body;

    const customers = await Customer.find({
      userId: req.user._id,
    });

    const customerData = customers.map((c) => ({
      name: c.name,
      email: c.email,
      segment: c.segment,
      totalSpent: c.totalSpent,
      totalOrders: c.totalOrders,
      churnRisk: c.churnRisk,
      churnScore: c.churnScore,
      inactiveDays: c.inactiveDays,
    }));

    const prompt = `
You are Salesforce Einstein Copilot.

You are helping a CRM manager.

Customer Database:

${JSON.stringify(customerData, null, 2)}

User Question:

${message}

Rules:

- Answer like a business analyst.
- Give actionable insights.
- Mention customer names.
- Mention churn risks.
- Mention revenue opportunities.
- Keep response under 250 words.
`;

    const response =
      await callOpenRouter(prompt);

    res.json({
      answer: response,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};