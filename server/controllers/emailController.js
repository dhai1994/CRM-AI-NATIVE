import transporter
from "../services/emailService.js";

import Customer
from "../models/Customer.js";

export const sendEmail =
async (req, res) => {
 try {

  const {
   to,
   subject,
   message,
  } = req.body;

  await transporter.sendMail({
   from:
    process.env.EMAIL_USER,

   to,

   subject,

   html: message,
  });

  res.json({
   success: true,
  });

 } catch (error) {

  res.status(500).json({
   message:
    error.message,
  });

 }
};

export const sendBulkEmail =
async (req, res) => {

 try {

  const {
   subject,
   message,
  } = req.body;

  const customers =
   await Customer.find();

  for (
   const customer
   of customers
  ) {

   await transporter.sendMail({
    from:
     process.env.EMAIL_USER,

    to:
     customer.email,

    subject,

    html: message,
   });

  }

  res.json({
   success: true,
   emailsSent:
    customers.length,
  });

 } catch (error) {

  res.status(500).json({
   message:
    error.message,
  });

 }

};