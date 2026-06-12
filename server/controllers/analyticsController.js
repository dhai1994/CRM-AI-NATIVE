import Customer from "../models/Customer.js";
import { analyticsAgent } from "../services/analyticsAgent.js";

export const getAnalytics = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id });

    const totalCustomers = customers.length;

    const vipCustomers = customers.filter(
      (c) => Number(c.totalSpent || 0) >= 5000
    ).length;

    const totalRevenue = customers.reduce(
      (sum, c) => sum + Number(c.totalSpent || 0),
      0
    );

    const activeCustomers = customers.filter(
      (c) => Number(c.totalOrders || 0) > 0
    ).length;

    const inactiveCustomers = totalCustomers - activeCustomers;

    res.json({
      totalCustomers,
      vipCustomers,
      activeCustomers,
      inactiveCustomers,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInsights = async (req, res) => {
  try {
    const stats = req.body;
    const insights = await analyticsAgent(stats);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};