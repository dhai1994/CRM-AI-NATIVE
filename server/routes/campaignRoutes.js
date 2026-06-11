import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createCampaign,
  getCampaigns,
  updateCampaignStatus,
} from "../controllers/campaignController.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createCampaign
);

router.get(
  "/",
  protect,
  getCampaigns
);

router.put(
  "/:id/status",
  protect,
  updateCampaignStatus
);

router.get(
 "/:id",
 protect,
 getCampaignById
);

export default router;