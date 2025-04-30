const express = require("express");
const paymentRoute = express.Router();

const controller = require("../controllers/userpayment.controller");
const paymentcontroller = require("../controllers/payment.controller");

paymentRoute
  .route("/api/paymentDetails")
  .post(controller.create_paymentDetails);
paymentRoute
  .route("/api/paymentDetails/:user_id")
  .get(controller.getPaymentDetailsByUserId);

paymentRoute.route("/api/createpayment").post(paymentcontroller.create_Payment);

module.exports = paymentRoute;
