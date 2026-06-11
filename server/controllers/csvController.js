import fs from "fs";
import csv from "csv-parser";

import Customer from "../models/Customer.js";

export const uploadCSV = async (
  req,
  res
) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) =>
      results.push(data)
    )
    .on("end", async () => {
      await Customer.insertMany(results);

      res.json({
        message:
          "Customers Imported Successfully",
      });
    });
};