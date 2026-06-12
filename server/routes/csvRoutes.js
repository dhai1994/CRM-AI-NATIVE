
import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/authMiddleware.js";
import { uploadCSV } from "../controllers/csvController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadCSV);

export default router;