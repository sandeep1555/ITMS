-- Internal Task Management System (ITMS) Database Schema
-- MySQL Database Structure with Sample Data

CREATE DATABASE IF NOT EXISTS itms;
USE itms;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role_id INT NOT NULL DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role_id (role_id)
);

-- Roles Table
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Add Foreign Key for users role_id
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

-- Projects Table
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id INT NOT NULL,
  status ENUM('active', 'archived', 'inactive') DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner_id (owner_id),
  INDEX idx_status (status)
);

-- Project Members Table
CREATE TABLE project_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_user (project_id, user_id),
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id)
);

-- Tasks Table
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INT,
  created_by INT NOT NULL,
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  due_date DATETIME,
  is_overdue BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_due_date (due_date),
  INDEX idx_is_overdue (is_overdue),
  INDEX idx_created_by (created_by)
);

-- Subtasks Table
CREATE TABLE subtasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INT,
  status ENUM('open', 'in_progress', 'completed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_task_id (task_id),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_status (status)
);

-- Task Observers Table
CREATE TABLE task_observers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_task_observer (task_id, user_id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id)
);

-- Task Activity Logs Table
CREATE TABLE task_activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Notifications Table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipient_id INT NOT NULL,
  task_id INT,
  sender_id INT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  INDEX idx_type (type)
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'admin', 'Administrator with full system access'),
(2, 'manager', 'Project manager with team management access'),
(3, 'user', 'Regular user with basic access');

-- Insert Users
INSERT INTO users (id, username, email, password_hash, first_name, last_name, role_id, is_active) VALUES
(1, 'admin_user', 'admin@itms.com', '$2a$10$YixZPyDde8RjWJWmb5lzeODlUQferTEHNr8DRG1X3k1gyWLEb5BJm', 'Admin', 'User', 1, TRUE),
(2, 'manager_user', 'manager@itms.com', '$2a$10$YixZPyDde8RjWJWmb5lzeODlUQferTEHNr8DRG1X3k1gyWLEb5BJm', 'Manager', 'User', 2, TRUE),
(3, 'john_doe', 'john@itms.com', '$2a$10$YixZPyDde8RjWJWmb5lzeODlUQferTEHNr8DRG1X3k1gyWLEb5BJm', 'John', 'Doe', 3, TRUE),
(4, 'jane_smith', 'jane@itms.com', '$2a$10$YixZPyDde8RjWJWmb5lzeODlUQferTEHNr8DRG1X3k1gyWLEb5BJm', 'Jane', 'Smith', 3, TRUE),
(5, 'bob_wilson', 'bob@itms.com', '$2a$10$YixZPyDde8RjWJWmb5lzeODlUQferTEHNr8DRG1X3k1gyWLEb5BJm', 'Bob', 'Wilson', 3, TRUE);

-- Insert Projects
INSERT INTO projects (id, name, description, owner_id, status, start_date, end_date) VALUES
(1, 'Website Redesign', 'Complete redesign of company website', 2, 'active', '2024-01-01', '2024-06-30'),
(2, 'Mobile App Development', 'Develop iOS and Android mobile application', 2, 'active', '2024-02-01', '2024-08-31'),
(3, 'API Integration', 'Integrate third-party APIs into system', 1, 'active', '2024-03-01', '2024-05-31'),
(4, 'Database Migration', 'Migrate from SQL Server to MySQL', 2, 'archived', '2023-09-01', '2024-02-28'),
(5, 'Security Audit', 'Conduct comprehensive security audit', 1, 'active', '2024-04-01', '2024-06-30');

-- Insert Project Members
INSERT INTO project_members (id, project_id, user_id, role) VALUES
(1, 1, 2, 'lead'),
(2, 1, 3, 'member'),
(3, 1, 4, 'member'),
(4, 2, 2, 'lead'),
(5, 2, 5, 'member'),
(6, 3, 1, 'lead'),
(7, 3, 3, 'member'),
(8, 4, 2, 'lead'),
(9, 4, 4, 'member'),
(10, 5, 1, 'lead');

-- Insert Tasks
INSERT INTO tasks (id, project_id, title, description, assignee_id, created_by, status, priority, due_date, is_overdue) VALUES
(1, 1, 'Design homepage layout', 'Create mockups and design for new homepage', 3, 2, 'in_progress', 'high', '2024-01-15', FALSE),
(2, 1, 'Setup development environment', 'Install and configure all necessary tools', 4, 2, 'completed', 'medium', '2024-01-10', FALSE),
(3, 2, 'Create API endpoints', 'Develop RESTful API for mobile app', 5, 2, 'open', 'critical', '2024-02-28', FALSE),
(4, 2, 'Implement authentication', 'Add user authentication mechanism', 3, 2, 'in_progress', 'high', '2024-02-20', FALSE),
(5, 3, 'Integrate payment gateway', 'Add payment processing capability', 1, 1, 'open', 'critical', '2024-03-30', FALSE);

-- Insert Subtasks
INSERT INTO subtasks (id, task_id, title, description, assignee_id, status, priority, due_date) VALUES
(1, 1, 'Create wireframes', 'Wireframe design for homepage', 3, 'in_progress', 'high', '2024-01-12'),
(2, 1, 'Get client approval', 'Present design to client for feedback', 2, 'open', 'high', '2024-01-14'),
(3, 3, 'User endpoints', 'Create user management API endpoints', 5, 'in_progress', 'high', '2024-02-20'),
(4, 3, 'Task endpoints', 'Create task management API endpoints', 5, 'open', 'high', '2024-02-25'),
(5, 4, 'JWT token implementation', 'Implement JWT authentication', 3, 'in_progress', 'critical', '2024-02-18');

-- Insert Task Observers
INSERT INTO task_observers (id, task_id, user_id) VALUES
(1, 1, 2),
(2, 1, 4),
(3, 2, 2),
(4, 3, 1),
(5, 3, 2),
(6, 4, 2),
(7, 5, 1),
(8, 5, 3);

-- Insert Task Activity Logs
INSERT INTO task_activity_logs (id, task_id, user_id, action, field_name, old_value, new_value, description) VALUES
(1, 1, 2, 'created', NULL, NULL, NULL, 'Task created'),
(2, 1, 2, 'assigned', 'assignee_id', NULL, '3', 'Task assigned to John Doe'),
(3, 1, 3, 'status_changed', 'status', 'open', 'in_progress', 'Task moved to in progress'),
(4, 2, 2, 'created', NULL, NULL, NULL, 'Task created'),
(5, 2, 4, 'status_changed', 'status', 'in_progress', 'completed', 'Task marked as completed');

-- Insert Notifications
INSERT INTO notifications (id, recipient_id, task_id, sender_id, type, title, message, is_read) VALUES
(1, 3, 1, 2, 'task_assigned', 'Task Assigned', 'You have been assigned to task: Design homepage layout', FALSE),
(2, 4, 2, 2, 'task_assigned', 'Task Assigned', 'You have been assigned to task: Setup development environment', TRUE),
(3, 5, 3, 2, 'task_assigned', 'Task Assigned', 'You have been assigned to task: Create API endpoints', FALSE),
(4, 1, 5, 1, 'task_assigned', 'Task Assigned', 'You have been assigned to task: Integrate payment gateway', FALSE),
(5, 2, 3, 1, 'observer_added', 'Added as Observer', 'You have been added as observer to task: Create API endpoints', FALSE);
