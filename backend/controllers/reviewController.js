const mongoose = require("mongoose");
const Review = require("../models/reviewModel");

async function create_Review(req, res) {
  try {
    const {
      decition,
      comment,
      product_id,
      cus_id,
      cus_name,
      cus_image,
      seller_id,
    } = req.body;

    const newReview = new Review({
      decition,
      comment,
      product_id,
      cus_id,
      cus_name,
      cus_image,
      seller_id,
    });

    await newReview.save();

    return res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding Review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getReviewByItemId(req, res) {
  const { product_id } = req.params;

  try {
    const reviews = await Review.find({ product_id });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for this product" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  create_Review,
  getReviewByItemId,
};
