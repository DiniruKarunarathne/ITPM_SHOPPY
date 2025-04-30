const express = require("express");
const reviewRoute = express.Router();

const controller = require("../controllers/reviewController");

reviewRoute.route("/api/review").post(controller.create_Review);
reviewRoute
  .route("/api/getreview/:product_id")
  .get(controller.getReviewByItemId);

module.exports = reviewRoute;
