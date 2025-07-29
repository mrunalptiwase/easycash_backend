const Task = require("../models/Task");

// User: Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// User: Complete a task
const completeTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = req.user;
    if (user.completedTasks.includes(id)) {
      return res.status(400).json({ message: "Task already completed" });
    }

    user.coins += task.reward;
    user.completedTasks.push(id);
    await user.save();

    res.json({ message: "Task completed", coins: user.coins });
  } catch (err) {
    res.status(500).json({ message: "Error completing task" });
  }
};

// Admin: Create a task
const createTask = async (req, res) => {
  const { title, description, reward, link } = req.body;
  try {
    const newTask = new Task({ title, description, reward, link });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// Admin: Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, reward, link } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = title || task.title;
    task.description = description || task.description;
    task.reward = reward || task.reward;
    task.link = link || task.link;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// Admin: Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

module.exports = {
  getTasks,
  completeTask,
  createTask,
  updateTask,
  deleteTask,
};
