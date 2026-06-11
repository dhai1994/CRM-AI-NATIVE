import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  generateCampaign,
} from "../controllers/aiController.js";

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

const router = express.Router();

router.post(
  "/planner",
  protect,
  async (req, res) => {
    try {
      const { goal } = req.body;

      const result =
        await plannerAgent(goal);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/segment",
  protect,
  async (req, res) => {
    try {
      const { goal } = req.body;

      const result =
        await segmentAgent(goal);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/campaign",
  protect,
  async (req, res) => {
    try {
      const { goal } = req.body;

      const result =
        await campaignAgent(goal);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/analytics",
  protect,
  async (req, res) => {
    try {
      const result =
        await analyticsAgent(
          req.body
        );

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/generate",
  protect,
  generateCampaign
);

export default router;

