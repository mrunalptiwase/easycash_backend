const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

const completeTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const alreadyCompleted = task.completedBy.some(
      (entry) => entry.userId.toString() === userId.toString()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: "Task already completed" });
    }

    task.completedBy.push({ userId });
    await task.save();

    res.status(200).json({ message: "Task completed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error completing task" });
  }
};

module.exports = {
  getAllTasks,
  completeTask,
};
