import pool from '../config/database.js';

export class SubtaskService {
  async createSubtask(taskId, title, description, assigneeId, priority, dueDate) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO subtasks (task_id, title, description, assignee_id, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
        [taskId, title, description, assigneeId, priority, dueDate]
      );

      return await this.getSubtaskById(result.insertId);
    } finally {
      connection.release();
    }
  }

  async getSubtaskById(subtaskId) {
    const connection = await pool.getConnection();
    try {
      const [subtasks] = await connection.query(
        `SELECT s.*, a.username as assignee_username, a.first_name, a.last_name
        FROM subtasks s
        LEFT JOIN users a ON s.assignee_id = a.id
        WHERE s.id = ?`,
        [subtaskId]
      );

      if (subtasks.length === 0) {
        throw new Error('Subtask not found');
      }

      return subtasks[0];
    } finally {
      connection.release();
    }
  }

  async getSubtasksByTask(taskId) {
    const connection = await pool.getConnection();
    try {
      const [subtasks] = await connection.query(
        `SELECT s.*, a.username as assignee_username FROM subtasks s
        LEFT JOIN users a ON s.assignee_id = a.id
        WHERE s.task_id = ? ORDER BY s.priority DESC, s.due_date ASC`,
        [taskId]
      );
      return subtasks;
    } finally {
      connection.release();
    }
  }

  async updateSubtask(subtaskId, updateData) {
    const connection = await pool.getConnection();
    try {
      const { title, description, assigneeId, status, priority, dueDate } = updateData;
      const currentSubtask = await this.getSubtaskById(subtaskId);

      await connection.query(
        'UPDATE subtasks SET title = ?, description = ?, assignee_id = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
        [title || currentSubtask.title, description || currentSubtask.description, assigneeId || currentSubtask.assignee_id, status || currentSubtask.status, priority || currentSubtask.priority, dueDate || currentSubtask.due_date, subtaskId]
      );

      return await this.getSubtaskById(subtaskId);
    } finally {
      connection.release();
    }
  }

  async deleteSubtask(subtaskId) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM subtasks WHERE id = ?', [subtaskId]);
      return { success: true };
    } finally {
      connection.release();
    }
  }
}
