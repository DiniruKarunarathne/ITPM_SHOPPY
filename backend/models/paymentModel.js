const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    
  },

  // holder: {
  //   type: String,
  //   required: true,
  // },
  // card: {
  //   type: String,
  //   required: true,
  // },
  // expire: {
  //   type: String,
  //   required: true,
  // },
  // cvc: {
  //   type: String,
  //   required: true,
  // },
  addres: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  totalQty: {
    type: String,
    // required: true,
  },
  totalPrice: {
    type: String,
    // required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
