import pool from '../config/database.js';

export class ProjectService {
  async createProject(name, description, ownerId, startDate, endDate) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO projects (name, description, owner_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [name, description, ownerId, startDate, endDate]
      );

      await connection.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
        [result.insertId, ownerId, 'lead']
      );

      return await this.getProjectById(result.insertId);
    } finally {
      connection.release();
    }
  }

  async getProjectById(projectId) {
    const connection = await pool.getConnection();
    try {
      const [projects] = await connection.query(
        'SELECT p.*, u.first_name, u.last_name FROM projects p JOIN users u ON p.owner_id = u.id WHERE p.id = ?',
        [projectId]
      );

      if (projects.length === 0) {
        throw new Error('Project not found');
      }

      return projects[0];
    } finally {
      connection.release();
    }
  }

  async getAllProjects() {
    const connection = await pool.getConnection();
    try {
      const [projects] = await connection.query(
        'SELECT p.*, u.first_name, u.last_name FROM projects p JOIN users u ON p.owner_id = u.id'
      );
      return projects;
    } finally {
      connection.release();
    }
  }

  async getProjectsByUser(userId) {
    const connection = await pool.getConnection();
    try {
      const [projects] = await connection.query(
        `SELECT DISTINCT p.*, u.first_name, u.last_name FROM projects p
        JOIN users u ON p.owner_id = u.id
        WHERE p.owner_id = ? OR EXISTS (
          SELECT 1 FROM project_members WHERE project_id = p.id AND user_id = ?
        )`,
        [userId, userId]
      );
      return projects;
    } finally {
      connection.release();
    }
  }

  async updateProject(projectId, updateData) {
    const connection = await pool.getConnection();
    try {
      const { name, description, status, startDate, endDate } = updateData;
      await connection.query(
        'UPDATE projects SET name = ?, description = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?',
        [name, description, status, startDate, endDate, projectId]
      );

      return await this.getProjectById(projectId);
    } finally {
      connection.release();
    }
  }

  async addProjectMember(projectId, userId, role = 'member') {
    const connection = await pool.getConnection();
    try {
      const [existingMember] = await connection.query(
        'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );

      if (existingMember.length > 0) {
        throw new Error('User is already a member of this project');
      }

      await connection.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
        [projectId, userId, role]
      );

      return { projectId, userId, role };
    } finally {
      connection.release();
    }
  }

  async removeProjectMember(projectId, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );

      return { success: true };
    } finally {
      connection.release();
    }
  }

  async getProjectMembers(projectId) {
    const connection = await pool.getConnection();
    try {
      const [members] = await connection.query(
        `SELECT pm.*, u.username, u.email, u.first_name, u.last_name FROM project_members pm
        JOIN users u ON pm.user_id = u.id WHERE pm.project_id = ?`,
        [projectId]
      );
      return members;
    } finally {
      connection.release();
    }
  }
}
