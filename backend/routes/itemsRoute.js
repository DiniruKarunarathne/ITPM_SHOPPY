// Import necessary modules and middleware
const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemsController");

router.post("/get/category", itemController.getItemsByCategory)

module.exports = router;