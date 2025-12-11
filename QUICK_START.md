# Quick Start Guide - ITMS Backend

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Database

### Import Schema
```bash
mysql -u root -p < database.sql
```

When prompted, enter your MySQL root password.

## 3. Configure Environment

Create `.env` file in project root:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=itms
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 4. Start Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server will start on `http://localhost:5000`

## 5. Test API

Check health endpoint:
```bash
curl http://localhost:5000/health
```

### Login with Sample User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@itms.com","password":"password"}'
```

Note: Sample passwords in database.sql are hashed. Replace with actual bcryptjs hashes or use the register endpoint.

## 6. API Documentation

See `API_DOCUMENTATION.md` for complete endpoint reference.

## Project Structure at a Glance

```
src/
├── config/       # Database configuration
├── controllers/  # Request handlers (6 files)
├── services/     # Business logic (6 files)
├── routes/       # API routes (6 files)
├── middleware/   # Auth, validation, error (3 files)
├── utils/        # Helpers (3 files)
├── jobs/         # Background jobs (1 file)
└── index.js      # Server entry point

database.sql      # MySQL schema + sample data
package.json      # Dependencies
.env              # Configuration
```

## Available Commands

```bash
npm start         # Start production server
npm run dev       # Start development server with nodemon
npm test          # Run tests (not configured yet)
npm run build     # Build project (if needed)
```

## Common Endpoints

**Register**
```bash
POST /api/auth/register
```

**Login**
```bash
POST /api/auth/login
```

**Get Profile**
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

**Create Project**
```bash
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**Create Task**
```bash
POST /api/tasks/projects/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "assigneeId": 2,
  "priority": "high",
  "dueDate": "2024-02-28"
}
```

## Troubleshooting

### Cannot connect to database
- Ensure MySQL is running: `mysql -u root -p`
- Check credentials in `.env`
- Verify database exists: `mysql -u root -p itms`

### Port 5000 already in use
- Kill process: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env`

### Module not found errors
- Run `npm install` again
- Check file paths in imports

### JWT errors
- Ensure JWT_SECRET is set in `.env`
- Check token format: `Authorization: Bearer <token>`

## Features Ready to Use

✓ User authentication (register/login)
✓ Role-based access control
✓ Project management
✓ Task management with observers
✓ Subtask support
✓ Activity logging
✓ Notifications
✓ Cron job for overdue marking
✓ CORS enabled
✓ Input validation
✓ Error handling

## Next Steps

1. Review `API_DOCUMENTATION.md` for all endpoints
2. Test endpoints using curl, Postman, or Insomnia
3. Integrate with frontend application
4. Add additional features as needed
5. Set up testing framework
6. Configure production environment

## Support Files

- `README.md` - Complete documentation
- `API_DOCUMENTATION.md` - Detailed endpoint guide
- `PROJECT_SUMMARY.md` - Architecture overview
- `database.sql` - Database schema

---
Happy coding! 🚀
