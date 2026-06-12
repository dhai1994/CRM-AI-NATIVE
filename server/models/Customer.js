import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,
    email: String,
    phone: String,

    totalSpent: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    lastPurchaseDate: Date,

    segment: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Customer", customerSchema);


