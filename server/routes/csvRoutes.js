import express from "express";

import upload from "../config/multer.js";

import { uploadCSV }
from "../controllers/csvController.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  uploadCSV
);

export default router;