import pool from '../config/database.js';

export class UserService {
  async getAllUsers() {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT u.id, u.username, u.email, u.first_name, u.last_name, r.name as role, u.is_active FROM users u JOIN roles r ON u.role_id = r.id'
      );
      return users;
    } finally {
      connection.release();
    }
  }

  async getUserById(userId) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT u.id, u.username, u.email, u.first_name, u.last_name, r.name as role, u.is_active FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      return users[0];
    } finally {
      connection.release();
    }
  }

  async updateUser(userId, updateData) {
    const connection = await pool.getConnection();
    try {
      const { firstName, lastName, email } = updateData;
      await connection.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
        [firstName, lastName, email, userId]
      );

      return await this.getUserById(userId);
    } finally {
      connection.release();
    }
  }

  async updateUserRole(userId, roleId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE users SET role_id = ? WHERE id = ?',
        [roleId, userId]
      );

      return await this.getUserById(userId);
    } finally {
      connection.release();
    }
  }

  async deactivateUser(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE users SET is_active = FALSE WHERE id = ?',
        [userId]
      );

      return await this.getUserById(userId);
    } finally {
      connection.release();
    }
  }

  async reactivateUser(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE users SET is_active = TRUE WHERE id = ?',
        [userId]
      );

      return await this.getUserById(userId);
    } finally {
      connection.release();
    }
  }
}
