import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    campaignName: String,
    goal: String,
    planner: String,
    segment: String,
    campaignContent: String,

    audienceSize: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Campaign", campaignSchema);