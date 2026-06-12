import Customer from "../models/Customer.js";
import Campaign from "../models/Campaign.js";
import { analyticsAgent } from "../services/analyticsAgent.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ userId: req.user._id });

    const vipCustomers = await Customer.countDocuments({
      userId: req.user._id,
      totalSpent: { $gte: 5000 },
    });

    const customers = await Customer.find({ userId: req.user._id });

    const totalRevenue = customers.reduce(
      (sum, customer) => sum + Number(customer.totalSpent || 0),
      0
    );

    res.json({
      totalCustomers,
      vipCustomers,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentData = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const campaigns = await Campaign.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ customers, campaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendation = async (req, res) => {
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

    const recommendation = await analyticsAgent({
      totalCustomers,
      vipCustomers,
      totalRevenue,
      activeCustomers,
      inactiveCustomers,
    });

    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};