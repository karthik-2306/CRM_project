const pool = require('../config/database');

const TaskModel = {
  async getAllTasks() {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, taskOwner, subject, dueDate, contact, account, status, priority FROM tasks'
    );
    connection.release();
    return rows;
  },

  async getTaskById(id) {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  },

  async createTask(formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO tasks 
      (taskOwner, subject, dueDate, contact, account, status, priority, reminder, repeats) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formData.taskOwner,
        formData.subject,
        formData.dueDate,
        formData.contact,
        formData.account,
        formData.status,
        formData.priority,
        formData.reminder,
        formData.repeats ? 1 : 0,
      ]
    );
    const taskId = result.insertId;
    connection.release();
    return taskId;
  },

  async updateTask(id, formData) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE tasks 
      SET taskOwner=?, subject=?, dueDate=?, contact=?, account=?, status=?, priority=?, reminder=?, repeats=? 
      WHERE id=?;`,
      [
        formData.taskOwner,
        formData.subject,
        formData.dueDate,
        formData.contact,
        formData.account,
        formData.status,
        formData.priority,
        formData.reminder,
        formData.repeats ? 1 : 0,
        id,
      ]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  async deleteTask(id) {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM tasks WHERE id=?;', [id]);
    connection.release();
    return result.affectedRows > 0;
  },
};

module.exports = TaskModel;
