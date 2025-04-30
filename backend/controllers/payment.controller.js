const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");

async function create_Payment(req, res) {
  try {
    const {
      email,
      user_id,
      holder,
      card,
      expire,
      cvc,
      addres,
      state,
      zip,
      totalQty,
      totalPrice,
    } = req.body;

    const newReview = new Payment({
      email,
      user_id,
      holder,
      card,
      expire,
      cvc,
      addres,
      state,
      zip,
      totalQty,
      totalPrice,
    });

    await newReview.save();

    return res.status(201).json({ message: "Creatge payment successfully" });
  } catch (error) {
    console.error("Error create Payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create_Payment,
};
