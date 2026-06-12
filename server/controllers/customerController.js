import Customer from "../models/Customer.js";

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user._id });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};