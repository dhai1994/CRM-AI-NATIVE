import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
 getDashboardStats,
 getRecentData,
 getRecommendation
}
from "../controllers/dashboardController.js";

const router =
 express.Router();

router.get(
 "/hello",
 (req,res)=>{
  res.json({
   message:"hello"
  });
 }
);

router.get(
 "/stats",
 protect,
 getDashboardStats
);

router.get(
 "/recent",
 protect,
 getRecentData
);

router.get(
 "/recommendation",
 protect,
 getRecommendation
);

export default router;