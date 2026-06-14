import Customer from "../models/Customer.js";

import axios from "axios";

import { calculateChurn }
from "../services/churnService.js";

import { callOpenRouter }
from "../services/openrouter.js";


function daysSince(dateValue) {
  if (!dateValue) return 999;
  const diff = new Date() - new Date(dateValue);
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}


export const getChurnPredictions = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const predictions = customers.map(calculateChurn).sort((a, b) => b.churnScore - a.churnScore);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChurnSummary = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id });
    const predictions = customers.map(calculateChurn);

    const highRisk = predictions.filter((c) => c.churnRisk === "HIGH").length;
    const mediumRisk = predictions.filter((c) => c.churnRisk === "MEDIUM").length;
    const lowRisk = predictions.filter((c) => c.churnRisk === "LOW").length;

    res.json({
      totalCustomers: predictions.length,
      highRisk,
      mediumRisk,
      lowRisk,
      predictions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshChurnScores =
  async (req, res) => {
    try {

      const customers =
        await Customer.find({
          userId:
            req.user._id,
        });

      let updated = 0;

      for (
        const customer of customers
      ) {

        const result =
          calculateChurn(
            customer
          );

        const prompt = `
You are a CRM retention expert.

Customer:
Name: ${customer.name}

Total Spend:
${customer.totalSpent}

Orders:
${customer.totalOrders}

Inactive Days:
${result.inactiveDays}

Churn Score:
${result.score}

Risk:
${result.churnRisk}

Return ONLY JSON:

{
 "reason":"...",
 "action":"..."
}
`;

        let aiReason =
          "Customer becoming inactive.";

        let aiAction =
          "Send win-back campaign.";

        try {

  const aiResponse =
    await callOpenRouter(
      prompt
    );

  console.log(
    "AI Response:",
    aiResponse
  );

  const parsed =
    JSON.parse(
      aiResponse
    );

  aiReason =
    parsed.reason;

  aiAction =
    parsed.action;

} catch (err) {

  console.log(
    "AI Parse Failed"
  );

}

        customer.churnScore =
          result.score;

        customer.churnRisk =
          result.churnRisk;

        customer.inactiveDays =
          result.inactiveDays;

        customer.churnReason =
          aiReason;

        customer.recommendedAction =
          aiAction;

        customer.lastChurnCalculatedAt =
          new Date();

        await customer.save();

        updated++;

      }

      res.json({
        message:
          "Churn Refresh Complete",
        updated,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
};

export const generateExecutiveReport =
  async (req, res) => {
    try {

      const customers =
        await Customer.find({
          userId:
            req.user._id,
        });

      const total =
        customers.length;

      const highRisk =
        customers.filter(
          (c) =>
            c.churnRisk ===
            "HIGH"
        ).length;

      const mediumRisk =
        customers.filter(
          (c) =>
            c.churnRisk ===
            "MEDIUM"
        ).length;

      const lowRisk =
        customers.filter(
          (c) =>
            c.churnRisk ===
            "LOW"
        ).length;

      const prompt = `
You are a CRM strategist.

Generate a concise executive churn report.

Data:

Total Customers:
${total}

High Risk:
${highRisk}

Medium Risk:
${mediumRisk}

Low Risk:
${lowRisk}

Give:

1. Key Insights
2. Main Risk
3. Recommended Action

Keep under 200 words.
`;

      const report =
        await callOpenRouter(
          prompt
        );

      res.json({
        report,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
};

export const predictFutureChurn = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id });

    customers.forEach((c) => {
  console.log(
    c.name,
    "lastPurchaseDate:",
    c.lastPurchaseDate
  );
});

    const input = customers.map((c) => ({
      _id: c._id,
      inactiveDays: daysSince(c.lastPurchaseDate),
      totalOrders: c.totalOrders || 0,
      totalSpent:  c.totalSpent || 0,
    }));
const { data } = await axios.post(
  `${process.env.ML_SERVICE_URL}/predict`,
  { customers: input }
);
    // Merge predictions with customer names/emails
   const merged = data.map((pred) => {
  const cust = customers.find(
    (c) => String(c._id) === String(pred._id)
  );

  return {
    ...pred,

    name: cust?.name,
    email: cust?.email,
    segment: cust?.segment,

    totalOrders: cust?.totalOrders || 0,
    totalSpent: cust?.totalSpent || 0,

    inactiveDays: daysSince(
      cust?.lastPurchaseDate
    ),
  };
});

    res.json(merged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};