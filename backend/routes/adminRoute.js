const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Route to get all users
router.get("/users", adminController.getAllUsers);

// Route to update a user
router.put("/users/:id", adminController.updateUser);

// Route to delete a user
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
