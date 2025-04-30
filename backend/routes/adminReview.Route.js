const express = require("express");
const adminreviewRoute = express.Router();

const controller = require("../controllers/adminreview.controller");

adminreviewRoute.route("/api/getadminsellers").get(controller.getSellerbyRoles);
adminreviewRoute.route("/api/review").get(controller.getReviews);
adminreviewRoute.route("/api/admin/sendEmail").post(controller.sendEmail);

module.exports = adminreviewRoute;
