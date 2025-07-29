const express = require("express");
const { getAllTasks, completeTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", protect, getAllTasks);

// Complete a task
router.post("/:taskId/complete", protect, completeTask);

module.exports = router;
