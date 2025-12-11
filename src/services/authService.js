import pool from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/authHelper.js';

export class AuthService {
  async register(username, email, password, firstName, lastName) {
    const connection = await pool.getConnection();
    try {
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        throw new Error('Email or username already exists');
      }

      const passwordHash = await hashPassword(password);
      const [result] = await connection.query(
        'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [username, email, passwordHash, firstName, lastName]
      );

      return { id: result.insertId, username, email, firstName, lastName };
    } finally {
      connection.release();
    }
  }

  async login(email, password) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
        [email]
      );

      if (users.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = users[0];
      const isPasswordValid = await comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.name,
        username: user.username
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.name
        }
      };
    } finally {
      connection.release();
    }
  }

  async getUserById(userId) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.name,
        isActive: user.is_active
      };
    } finally {
      connection.release();
    }
  }
}
