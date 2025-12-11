# Internal Task Management System (ITMS)

A complete Node.js + Express.js backend for managing internal tasks with role-based access control, activity logging, and real-time notifications.

## Project Structure

```
src/
├── config/
│   └── database.js           # MySQL connection configuration
├── controllers/              # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── subtaskController.js
│   └── notificationController.js
├── services/                 # Business logic
│   ├── authService.js
│   ├── userService.js
│   ├── projectService.js
│   ├── taskService.js
│   ├── subtaskService.js
│   └── notificationService.js
├── routes/                   # API route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── subtaskRoutes.js
│   └── notificationRoutes.js
├── middleware/               # Express middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── utils/                    # Helper functions
│   ├── authHelper.js
│   ├── activityLogHelper.js
│   └── notificationHelper.js
├── jobs/
│   └── overdueCronJob.js     # Background job for marking overdue tasks
└── index.js                  # Main application entry point

database.sql                  # Complete MySQL schema with sample data
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create MySQL database and import schema:

```bash
mysql -u root -p < database.sql
```

### 3. Environment Configuration

Create `.env` file with the following variables:

```
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=itms

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

### 4. Start Server

```bash
npm start          # Production
npm run dev        # Development with nodemon
```

Server runs on `http://localhost:5000`

## Core Features

### Authentication
- User registration and login with JWT tokens
- Password hashing with bcryptjs
- Token-based authentication for protected routes

### User Management
- User profile management
- Role-based access control (Admin, Manager, User)
- User activation/deactivation

### Project Management
- Create and manage projects
- Add/remove project members
- Track project status and timeline

### Task Management
- Create tasks with priority, status, and due dates
- Assign tasks to team members
- Track task observers
- Automatic overdue marking via cron job

### Subtask Management
- Create subtasks within tasks
- Independent status tracking
- Priority and due date management

### Activity Logging
- Complete audit trail of all task changes
- Track who made what changes and when
- Log field-level changes (old and new values)

### Notifications
- Task assignment notifications
- Status change notifications
- Due date change notifications
- Observer addition notifications
- Unread notification tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user information
- `PUT /api/users/:userId/role` - Update user role (admin only)
- `PUT /api/users/:userId/deactivate` - Deactivate user (admin only)
- `PUT /api/users/:userId/reactivate` - Reactivate user (admin only)

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects (admin only)
- `GET /api/projects/my-projects` - Get user's projects
- `GET /api/projects/:projectId` - Get project by ID
- `PUT /api/projects/:projectId` - Update project
- `POST /api/projects/:projectId/members` - Add project member
- `DELETE /api/projects/:projectId/members/:userId` - Remove project member
- `GET /api/projects/:projectId/members` - Get project members

### Tasks
- `POST /api/tasks/projects/:projectId` - Create task
- `GET /api/tasks/projects/:projectId` - Get tasks by project
- `GET /api/tasks/my-tasks` - Get user's assigned tasks
- `GET /api/tasks/:taskId` - Get task by ID
- `PUT /api/tasks/:taskId` - Update task
- `POST /api/tasks/:taskId/observers` - Add task observer
- `DELETE /api/tasks/:taskId/observers/:userId` - Remove task observer
- `GET /api/tasks/:taskId/observers` - Get task observers
- `GET /api/tasks/:taskId/activity-logs` - Get task activity log

### Subtasks
- `POST /api/subtasks/tasks/:taskId` - Create subtask
- `GET /api/subtasks/tasks/:taskId` - Get subtasks by task
- `GET /api/subtasks/:subtaskId` - Get subtask by ID
- `PUT /api/subtasks/:subtaskId` - Update subtask
- `DELETE /api/subtasks/:subtaskId` - Delete subtask

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread/count` - Get unread count
- `GET /api/notifications/:notificationId` - Get notification by ID
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

## Database Schema

### Tables
- **users** - User accounts with roles
- **roles** - User roles (admin, manager, user)
- **projects** - Project management
- **project_members** - Project membership
- **tasks** - Task records with assignments
- **subtasks** - Sub-tasks within tasks
- **task_observers** - Task observers for notifications
- **task_activity_logs** - Audit trail for all task changes
- **notifications** - User notifications

All tables include:
- Foreign key constraints
- Proper indexing for performance
- Timestamps (created_at, updated_at)
- Sample data (5+ rows per table)

## Authentication & Authorization

### JWT Token
Tokens include user info and role. Include in requests:

```
Authorization: Bearer <token>
```

### Roles
- **admin** - Full system access
- **manager** - Team and project management
- **user** - Basic user access

### Protected Routes
Most routes require authentication. Role-based routes require specific roles (specified in route definitions).

## Background Jobs

### Overdue Task Cron Job
- Runs every hour
- Marks tasks as overdue when due date passes
- Logs activity for each marked task
- Handles both individual and batch operations

## Error Handling

- Comprehensive error messages
- HTTP status codes (400, 401, 403, 404, 500)
- Validation error responses
- Request validation using express-validator

## Security Features

- JWT authentication
- Password hashing with bcryptjs
- Role-based authorization
- Input validation
- Error handling without exposing sensitive info
- CORS configuration

## Development

### Nodemon Development Server
```bash
npm run dev
```

### Code Structure
- MVC architecture for clean separation of concerns
- Service layer for business logic
- Middleware for cross-cutting concerns
- Utilities for reusable functions
- Controllers for request/response handling

## Database Connections

The system uses MySQL 2 with connection pooling:
- Maximum 10 concurrent connections
- Automatic connection management
- Promise-based API for async/await support

## Notes

- Password hashing uses bcryptjs with 10 salt rounds
- JWT tokens expire after 7 days (configurable)
- Activity logs capture all task modifications
- Notifications trigger on specific events
- Sample data includes 5 users, 5 projects, 5 tasks, and 5 subtasks
