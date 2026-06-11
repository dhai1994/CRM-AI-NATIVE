import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
 sendEmail,
 sendBulkEmail
}
from "../controllers/emailController.js";

const router =
 express.Router();

router.post(
 "/send",
 protect,
 sendEmail
);

router.post(
 "/bulk-email/send",
 protect,
 sendBulkEmail
);

export default router;