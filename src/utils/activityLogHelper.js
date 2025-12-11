import pool from '../config/database.js';

export const logActivity = async (taskId, userId, action, fieldName = null, oldValue = null, newValue = null, description = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'INSERT INTO task_activity_logs (task_id, user_id, action, field_name, old_value, new_value, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [taskId, userId, action, fieldName, oldValue, newValue, description]
    );
  } catch (error) {
    console.error('Activity log error:', error);
  } finally {
    connection.release();
  }
};
