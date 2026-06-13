import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import csvRoutes from "./routes/csvRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import churnRoutes from "./routes/churnRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/churn", churnRoutes);

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});