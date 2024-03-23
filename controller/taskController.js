const TaskModel = require('../models/taskModel');

const TaskController = {
  async getAllTasks(req, res) {
    try {
      const tasks = await TaskModel.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getTaskById(req, res) {
    try {
      const taskId = req.params.id;
      const task = await TaskModel.getTaskById(taskId);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async createTask(req, res) {
    try {
      const formData = req.body;
      const taskId = await TaskModel.createTask(formData);
      res.json({ id: taskId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const formData = req.body;
      const success = await TaskModel.updateTask(taskId, formData);
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const success = await TaskModel.deleteTask(taskId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = TaskController;
