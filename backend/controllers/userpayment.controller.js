const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");

async function create_paymentDetails(req, res) {
  try {
    const { email,user_id,holder, card, expire,cvc,addres,state, zip} =
      req.body;

    const newPayment = new Payment({
      email,user_id,holder, card, expire,cvc,addres,state, zip
    });

    await newPayment.save();

    return res.status(201).json({ message: "Payment details added successfully" });
  } catch (error) {
    console.error("Error adding Payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getPaymentDetailsByUserId(req, res) {
  const { user_id } = req.params;

  try {
    const payment = await Payment.find({ user_id });
    if (payment.length === 0) {
      return res
        .status(404)
        .json({ error: "No Payment details found for this user" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching Payment :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create_paymentDetails,
  getPaymentDetailsByUserId,
};
