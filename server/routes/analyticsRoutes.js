import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getAnalytics,
} from "../controllers/analyticsController.js";
import {
 getInsights
}
from "../controllers/analyticsController.js";

const router =
  express.Router();
router.post(
 "/insights",
 protect,
 getInsights
);
router.get(
  "/",
  protect,
  getAnalytics
);

export default router;