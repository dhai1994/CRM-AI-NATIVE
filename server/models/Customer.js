import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    phone: String,

    totalSpent: {
      type: Number,
      default: 0
    },

    totalOrders: {
      type: Number,
      default: 0
    },

    lastPurchaseDate: Date,

    segment: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Customer", customerSchema);