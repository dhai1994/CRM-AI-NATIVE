import fs from "fs";
import csv from "csv-parser";
import Customer from "../models/Customer.js";

export const uploadCSV = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) =>
      results.push({
        ...data,
        userId: req.user._id,
      })
    )
    .on("end", async () => {
      try {
        await Customer.insertMany(results);
        fs.unlinkSync(req.file.path);
        res.json({ message: "Customers Imported Successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
};

