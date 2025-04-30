const mongoose = require("mongoose");
const { User } = require("../models/auth.model");
const Review = require("../models/reviewModel");
const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "cartifyshop037@gmail.com", // Enter your Gmail email
    pass: "lrti etwg lcat ucpo", // Enter your Gmail password
  },
});

async function getSellerbyRoles(req, res) {
  try {
    // Find users with role 'Seller'
    const sellers = await User.find({ roles: "Seller" });

    if (sellers.length === 0) {
      return res.status(404).json({ error: "No sellers found" });
    }

    res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching sellers :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await Review.find();
    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function sendEmail(req, res) {
  const { email, description } = req.body;

  const mailOptions = {
    from: "cartifyshop037@gmail.com",
    to: email,
    subject: "Warning Notification",
    text: `Mr seller, ${description}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getSellerbyRoles,
  getReviews,
  sendEmail,
};
