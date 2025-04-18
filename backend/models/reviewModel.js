const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  decition: {
    type: String,
    // required: true,
  },
  comment: {
    type: String,
  },
  product_id: {
    type: String,
    // required: true,
  },
  cus_id: {
    type: String,
    // required: true,
  },
  cus_name: {
    type: String,
    // required: true,
  },
  cus_image: {
    type: String,
  },
  seller_id: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
