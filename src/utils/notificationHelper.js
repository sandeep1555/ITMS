import pool from '../config/database.js';

export const createNotification = async (recipientId, taskId, senderId, type, title, message) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO notifications (recipient_id, task_id, sender_id, type, title, message) VALUES (?, ?, ?, ?, ?, ?)',
      [recipientId, taskId, senderId, type, title, message]
    );
    return result.insertId;
  } catch (error) {
    console.error('Notification creation error:', error);
  } finally {
    connection.release();
  }
};

export const notifyTaskAssignment = async (taskId, assigneeId, assignerUserId) => {
  const connection = await pool.getConnection();
  try {
    const [task] = await connection.query('SELECT title FROM tasks WHERE id = ?', [taskId]);
    if (task.length > 0) {
      await createNotification(
        assigneeId,
        taskId,
        assignerUserId,
        'task_assigned',
        'Task Assigned',
        `You have been assigned to task: ${task[0].title}`
      );
    }
  } catch (error) {
    console.error('Notify task assignment error:', error);
  } finally {
    connection.release();
  }
};

export const notifyStatusChange = async (taskId, changedByUserId, oldStatus, newStatus) => {
  const connection = await pool.getConnection();
  try {
    const [task] = await connection.query('SELECT title, assignee_id FROM tasks WHERE id = ?', [taskId]);
    if (task.length > 0 && task[0].assignee_id) {
      await createNotification(
        task[0].assignee_id,
        taskId,
        changedByUserId,
        'status_changed',
        'Task Status Updated',
        `Task "${task[0].title}" status changed from ${oldStatus} to ${newStatus}`
      );
    }
  } catch (error) {
    console.error('Notify status change error:', error);
  } finally {
    connection.release();
  }
};

export const notifyDueDateChange = async (taskId, changedByUserId, oldDueDate, newDueDate) => {
  const connection = await pool.getConnection();
  try {
    const [task] = await connection.query('SELECT title, assignee_id FROM tasks WHERE id = ?', [taskId]);
    if (task.length > 0 && task[0].assignee_id) {
      await createNotification(
        task[0].assignee_id,
        taskId,
        changedByUserId,
        'due_date_changed',
        'Task Due Date Updated',
        `Task "${task[0].title}" due date changed from ${oldDueDate} to ${newDueDate}`
      );
    }
  } catch (error) {
    console.error('Notify due date change error:', error);
  } finally {
    connection.release();
  }
};

export const notifyObserverAdded = async (taskId, observerId, addedByUserId) => {
  const connection = await pool.getConnection();
  try {
    const [task] = await connection.query('SELECT title FROM tasks WHERE id = ?', [taskId]);
    if (task.length > 0) {
      await createNotification(
        observerId,
        taskId,
        addedByUserId,
        'observer_added',
        'Added as Observer',
        `You have been added as observer to task: ${task[0].title}`
      );
    }
  } catch (error) {
    console.error('Notify observer added error:', error);
  } finally {
    connection.release();
  }
};
