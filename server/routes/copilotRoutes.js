import express from "express";
import protect from "../middleware/authMiddleware.js";
import { askCopilot } from "../controllers/copilotController.js";

const router = express.Router();

router.post(
  "/ask",
  protect,
  askCopilot
);

export default router;