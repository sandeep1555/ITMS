import pool from '../config/database.js';

export class NotificationService {
  async getNotifications(userId, limit = 20, offset = 0) {
    const connection = await pool.getConnection();
    try {
      const [notifications] = await connection.query(
        `SELECT n.*, s.username as sender_username, t.title as task_title
        FROM notifications n
        LEFT JOIN users s ON n.sender_id = s.id
        LEFT JOIN tasks t ON n.task_id = t.id
        WHERE n.recipient_id = ? ORDER BY n.created_at DESC LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return notifications;
    } finally {
      connection.release();
    }
  }

  async getUnreadNotificationsCount(userId) {
    const connection = await pool.getConnection();
    try {
      const [count] = await connection.query(
        'SELECT COUNT(*) as count FROM notifications WHERE recipient_id = ? AND is_read = FALSE',
        [userId]
      );
      return count[0].count;
    } finally {
      connection.release();
    }
  }

  async markAsRead(notificationId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND recipient_id = ?',
        [notificationId, userId]
      );
      return { success: true };
    } finally {
      connection.release();
    }
  }

  async markAllAsRead(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE recipient_id = ? AND is_read = FALSE',
        [userId]
      );
      return { success: true };
    } finally {
      connection.release();
    }
  }

  async deleteNotification(notificationId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'DELETE FROM notifications WHERE id = ? AND recipient_id = ?',
        [notificationId, userId]
      );
      return { success: true };
    } finally {
      connection.release();
    }
  }

  async getNotificationById(notificationId, userId) {
    const connection = await pool.getConnection();
    try {
      const [notifications] = await connection.query(
        `SELECT n.*, s.username as sender_username FROM notifications n
        LEFT JOIN users s ON n.sender_id = s.id
        WHERE n.id = ? AND n.recipient_id = ?`,
        [notificationId, userId]
      );

      if (notifications.length === 0) {
        throw new Error('Notification not found');
      }

      return notifications[0];
    } finally {
      connection.release();
    }
  }
}
