import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getChurnPredictions,
  getChurnSummary,
  refreshChurnScores,
  generateExecutiveReport,
} from "../controllers/churnController.js";

const router = express.Router();

router.get("/", protect, getChurnPredictions);

router.get(
  "/summary",
  protect,
  getChurnSummary
);

router.post(
  "/refresh",
  protect,
  refreshChurnScores
);

router.post(
  "/report",
  protect,
  generateExecutiveReport
);

export default router;