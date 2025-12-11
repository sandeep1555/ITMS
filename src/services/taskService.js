import pool from '../config/database.js';
import { logActivity } from '../utils/activityLogHelper.js';
import { notifyTaskAssignment, notifyStatusChange, notifyDueDateChange, notifyObserverAdded } from '../utils/notificationHelper.js';

export class TaskService {
  async createTask(projectId, title, description, assigneeId, createdBy, priority, dueDate) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO tasks (project_id, title, description, assignee_id, created_by, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [projectId, title, description, assigneeId, createdBy, priority, dueDate]
      );

      const taskId = result.insertId;
      await logActivity(taskId, createdBy, 'created', null, null, null, 'Task created');

      if (assigneeId) {
        await notifyTaskAssignment(taskId, assigneeId, createdBy);
        await logActivity(taskId, createdBy, 'assigned', 'assignee_id', null, assigneeId, `Task assigned to user ${assigneeId}`);
      }

      return await this.getTaskById(taskId);
    } finally {
      connection.release();
    }
  }

  async getTaskById(taskId) {
    const connection = await pool.getConnection();
    try {
      const [tasks] = await connection.query(
        `SELECT t.*, u.username, u.first_name, u.last_name, a.username as assignee_username, a.first_name as assignee_first_name, a.last_name as assignee_last_name
        FROM tasks t
        JOIN users u ON t.created_by = u.id
        LEFT JOIN users a ON t.assignee_id = a.id
        WHERE t.id = ?`,
        [taskId]
      );

      if (tasks.length === 0) {
        throw new Error('Task not found');
      }

      const task = tasks[0];
      const [observers] = await connection.query(
        'SELECT user_id, u.username FROM task_observers to JOIN users u ON to.user_id = u.id WHERE task_id = ?',
        [taskId]
      );

      task.observers = observers;
      return task;
    } finally {
      connection.release();
    }
  }

  async getTasksByProject(projectId) {
    const connection = await pool.getConnection();
    try {
      const [tasks] = await connection.query(
        `SELECT t.*, u.username, a.username as assignee_username FROM tasks t
        JOIN users u ON t.created_by = u.id
        LEFT JOIN users a ON t.assignee_id = a.id
        WHERE t.project_id = ? ORDER BY t.priority DESC, t.due_date ASC`,
        [projectId]
      );
      return tasks;
    } finally {
      connection.release();
    }
  }

  async getTasksByAssignee(assigneeId) {
    const connection = await pool.getConnection();
    try {
      const [tasks] = await connection.query(
        `SELECT t.*, u.username FROM tasks t
        JOIN users u ON t.created_by = u.id
        WHERE t.assignee_id = ? ORDER BY t.priority DESC, t.due_date ASC`,
        [assigneeId]
      );
      return tasks;
    } finally {
      connection.release();
    }
  }

  async updateTask(taskId, updatedBy, updateData) {
    const connection = await pool.getConnection();
    try {
      const currentTask = await this.getTaskById(taskId);
      const { title, description, assigneeId, status, priority, dueDate } = updateData;

      if (assigneeId && assigneeId !== currentTask.assignee_id) {
        await notifyTaskAssignment(taskId, assigneeId, updatedBy);
        await logActivity(taskId, updatedBy, 'assigned', 'assignee_id', currentTask.assignee_id, assigneeId);
      }

      if (status && status !== currentTask.status) {
        await notifyStatusChange(taskId, updatedBy, currentTask.status, status);
        await logActivity(taskId, updatedBy, 'status_changed', 'status', currentTask.status, status);
      }

      if (dueDate && dueDate !== currentTask.due_date) {
        await notifyDueDateChange(taskId, updatedBy, currentTask.due_date, dueDate);
        await logActivity(taskId, updatedBy, 'due_date_changed', 'due_date', currentTask.due_date, dueDate);
      }

      await connection.query(
        'UPDATE tasks SET title = ?, description = ?, assignee_id = ?, status = ?, priority = ?, due_date = ? WHERE id = ?',
        [title || currentTask.title, description || currentTask.description, assigneeId || currentTask.assignee_id, status || currentTask.status, priority || currentTask.priority, dueDate || currentTask.due_date, taskId]
      );

      return await this.getTaskById(taskId);
    } finally {
      connection.release();
    }
  }

  async addObserver(taskId, userId, addedBy) {
    const connection = await pool.getConnection();
    try {
      const [existingObserver] = await connection.query(
        'SELECT id FROM task_observers WHERE task_id = ? AND user_id = ?',
        [taskId, userId]
      );

      if (existingObserver.length > 0) {
        throw new Error('User is already observing this task');
      }

      await connection.query(
        'INSERT INTO task_observers (task_id, user_id) VALUES (?, ?)',
        [taskId, userId]
      );

      await notifyObserverAdded(taskId, userId, addedBy);
      await logActivity(taskId, addedBy, 'observer_added', 'observers', null, userId);

      return { taskId, userId };
    } finally {
      connection.release();
    }
  }

  async removeObserver(taskId, userId, removedBy) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'DELETE FROM task_observers WHERE task_id = ? AND user_id = ?',
        [taskId, userId]
      );

      await logActivity(taskId, removedBy, 'observer_removed', 'observers', userId, null);
      return { success: true };
    } finally {
      connection.release();
    }
  }

  async getTaskObservers(taskId) {
    const connection = await pool.getConnection();
    try {
      const [observers] = await connection.query(
        'SELECT user_id, u.username, u.email FROM task_observers to JOIN users u ON to.user_id = u.id WHERE task_id = ?',
        [taskId]
      );
      return observers;
    } finally {
      connection.release();
    }
  }

  async markTasksOverdue() {
    const connection = await pool.getConnection();
    try {
      const [tasks] = await connection.query(
        'SELECT id, assignee_id FROM tasks WHERE is_overdue = FALSE AND due_date < NOW() AND status != "completed" AND status != "cancelled"'
      );

      for (const task of tasks) {
        await connection.query(
          'UPDATE tasks SET is_overdue = TRUE WHERE id = ?',
          [task.id]
        );
        await logActivity(task.id, 1, 'marked_overdue', null, null, null, 'Task marked as overdue');
      }

      return tasks.length;
    } finally {
      connection.release();
    }
  }

  async getTaskActivityLog(taskId) {
    const connection = await pool.getConnection();
    try {
      const [logs] = await connection.query(
        `SELECT tal.*, u.username FROM task_activity_logs tal
        JOIN users u ON tal.user_id = u.id
        WHERE tal.task_id = ? ORDER BY tal.created_at DESC`,
        [taskId]
      );
      return logs;
    } finally {
      connection.release();
    }
  }
}
