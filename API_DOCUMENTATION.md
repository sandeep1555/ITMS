# API Documentation - ITMS Backend

## Overview
Complete REST API documentation for Internal Task Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except `/auth/register` and `/auth/login` require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true
  }
}
```

---

## User Endpoints

### Get All Users (Admin Only)
```
GET /users
Authorization: Bearer <admin_token>

Response (200):
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "is_active": true
    }
  ]
}
```

### Get User by ID
```
GET /users/:userId
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "is_active": true
  }
}
```

### Update User
```
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Johnny",
  "lastName": "Smith",
  "email": "johnny@example.com"
}

Response (200):
{
  "message": "User updated successfully",
  "user": { ... }
}
```

### Update User Role (Admin Only)
```
PUT /users/:userId/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "roleId": 2
}

Response (200):
{
  "message": "User role updated successfully",
  "user": { ... }
}
```

### Deactivate User (Admin Only)
```
PUT /users/:userId/deactivate
Authorization: Bearer <admin_token>

Response (200):
{
  "message": "User deactivated successfully",
  "user": { ... }
}
```

### Reactivate User (Admin Only)
```
PUT /users/:userId/reactivate
Authorization: Bearer <admin_token>

Response (200):
{
  "message": "User reactivated successfully",
  "user": { ... }
}
```

---

## Project Endpoints

### Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30"
}

Response (201):
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner_id": 1,
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### Get All Projects (Admin Only)
```
GET /projects
Authorization: Bearer <admin_token>

Response (200):
{
  "projects": [ ... ]
}
```

### Get My Projects
```
GET /projects/my-projects
Authorization: Bearer <token>

Response (200):
{
  "projects": [ ... ]
}
```

### Get Project by ID
```
GET /projects/:projectId
Authorization: Bearer <token>

Response (200):
{
  "project": { ... }
}
```

### Update Project
```
PUT /projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "archived",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}

Response (200):
{
  "message": "Project updated successfully",
  "project": { ... }
}
```

### Add Project Member
```
POST /projects/:projectId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 3,
  "role": "member"
}

Response (201):
{
  "message": "Member added successfully",
  "member": {
    "projectId": 1,
    "userId": 3,
    "role": "member"
  }
}
```

### Remove Project Member
```
DELETE /projects/:projectId/members/:userId
Authorization: Bearer <token>

Response (200):
{
  "message": "Member removed successfully"
}
```

### Get Project Members
```
GET /projects/:projectId/members
Authorization: Bearer <token>

Response (200):
{
  "members": [
    {
      "id": 1,
      "project_id": 1,
      "user_id": 2,
      "role": "lead",
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    }
  ]
}
```

---

## Task Endpoints

### Create Task
```
POST /tasks/projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups for homepage",
  "assigneeId": 3,
  "priority": "high",
  "dueDate": "2024-02-28"
}

Response (201):
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design Homepage",
    "description": "Create mockups for homepage",
    "assignee_id": 3,
    "created_by": 2,
    "status": "open",
    "priority": "high",
    "due_date": "2024-02-28",
    "is_overdue": false,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Get Tasks by Project
```
GET /tasks/projects/:projectId
Authorization: Bearer <token>

Response (200):
{
  "tasks": [ ... ]
}
```

### Get My Tasks
```
GET /tasks/my-tasks
Authorization: Bearer <token>

Response (200):
{
  "tasks": [ ... ]
}
```

### Get Task by ID
```
GET /tasks/:taskId
Authorization: Bearer <token>

Response (200):
{
  "task": {
    "id": 1,
    "project_id": 1,
    "title": "Design Homepage",
    "description": "Create mockups for homepage",
    "assignee_id": 3,
    "created_by": 2,
    "status": "in_progress",
    "priority": "high",
    "due_date": "2024-02-28",
    "is_overdue": false,
    "observers": [
      { "user_id": 2, "username": "manager_user" }
    ],
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Update Task
```
PUT /tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed",
  "assigneeId": 4,
  "priority": "critical",
  "dueDate": "2024-03-15"
}

Response (200):
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

### Add Task Observer
```
POST /tasks/:taskId/observers
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 4
}

Response (201):
{
  "message": "Observer added successfully",
  "observer": {
    "taskId": 1,
    "userId": 4
  }
}
```

### Remove Task Observer
```
DELETE /tasks/:taskId/observers/:userId
Authorization: Bearer <token>

Response (200):
{
  "message": "Observer removed successfully"
}
```

### Get Task Observers
```
GET /tasks/:taskId/observers
Authorization: Bearer <token>

Response (200):
{
  "observers": [
    {
      "user_id": 2,
      "username": "manager_user",
      "email": "manager@example.com"
    }
  ]
}
```

### Get Task Activity Log
```
GET /tasks/:taskId/activity-logs
Authorization: Bearer <token>

Response (200):
{
  "logs": [
    {
      "id": 1,
      "task_id": 1,
      "user_id": 2,
      "action": "created",
      "field_name": null,
      "old_value": null,
      "new_value": null,
      "description": "Task created",
      "username": "manager_user",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## Subtask Endpoints

### Create Subtask
```
POST /subtasks/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Create Wireframes",
  "description": "Wireframe the homepage layout",
  "assigneeId": 3,
  "priority": "high",
  "dueDate": "2024-02-15"
}

Response (201):
{
  "message": "Subtask created successfully",
  "subtask": { ... }
}
```

### Get Subtasks by Task
```
GET /subtasks/tasks/:taskId
Authorization: Bearer <token>

Response (200):
{
  "subtasks": [ ... ]
}
```

### Get Subtask by ID
```
GET /subtasks/:subtaskId
Authorization: Bearer <token>

Response (200):
{
  "subtask": { ... }
}
```

### Update Subtask
```
PUT /subtasks/:subtaskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed",
  "priority": "medium"
}

Response (200):
{
  "message": "Subtask updated successfully",
  "subtask": { ... }
}
```

### Delete Subtask
```
DELETE /subtasks/:subtaskId
Authorization: Bearer <token>

Response (200):
{
  "message": "Subtask deleted successfully"
}
```

---

## Notification Endpoints

### Get Notifications
```
GET /notifications?limit=20&offset=0
Authorization: Bearer <token>

Response (200):
{
  "notifications": [
    {
      "id": 1,
      "recipient_id": 1,
      "task_id": 1,
      "sender_id": 2,
      "type": "task_assigned",
      "title": "Task Assigned",
      "message": "You have been assigned to task: Design Homepage",
      "is_read": false,
      "created_at": "2024-01-15T10:00:00Z",
      "sender_username": "manager_user",
      "task_title": "Design Homepage"
    }
  ]
}
```

### Get Unread Count
```
GET /notifications/unread/count
Authorization: Bearer <token>

Response (200):
{
  "unreadCount": 5
}
```

### Get Notification by ID
```
GET /notifications/:notificationId
Authorization: Bearer <token>

Response (200):
{
  "notification": { ... }
}
```

### Mark as Read
```
PUT /notifications/:notificationId/read
Authorization: Bearer <token>

Response (200):
{
  "message": "Notification marked as read"
}
```

### Mark All as Read
```
PUT /notifications/read-all
Authorization: Bearer <token>

Response (200):
{
  "message": "All notifications marked as read"
}
```

### Delete Notification
```
DELETE /notifications/:notificationId
Authorization: Bearer <token>

Response (200):
{
  "message": "Notification deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Priority Levels

- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `critical` - Critical priority

## Task Status

- `open` - Task is open
- `in_progress` - Task is being worked on
- `completed` - Task is completed
- `cancelled` - Task is cancelled

## Subtask Status

- `open` - Subtask is open
- `in_progress` - Subtask is being worked on
- `completed` - Subtask is completed

## Project Status

- `active` - Project is active
- `archived` - Project is archived
- `inactive` - Project is inactive

## User Roles

- `admin` - Administrator (ID: 1)
- `manager` - Project Manager (ID: 2)
- `user` - Regular User (ID: 3)

---

## Sample Credentials

Use these credentials for testing:

```
Admin:
Email: admin@itms.com
Password: (hash in database - use bcryptjs to verify)

Manager:
Email: manager@itms.com
Password: (hash in database)

Regular User:
Email: john@itms.com
Password: (hash in database)
```

All sample users have password hash generated by bcryptjs. Use login endpoint to obtain tokens.
