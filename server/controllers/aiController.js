import {
  plannerAgent,
} from "../services/plannerAgent.js";

import {
  segmentAgent,
} from "../services/segmentAgent.js";

import {
  campaignAgent,
} from "../services/campaignAgent.js";

import {
  analyticsAgent,
} from "../services/analyticsAgent.js";

export const generateCampaign =
  async (req, res) => {
    try {
      const { goal } = req.body;

      const planner =
        await plannerAgent(goal);

      const segment =
        await segmentAgent(goal);

      const campaign =
        await campaignAgent(goal);

      const analytics =
        await analyticsAgent({
          goal,
        });

      res.json({
        planner,
        segment,
        campaign,
        analytics,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
