import express from 'express';
import { createTask, getTaskById, getTasksByProject, getMyTasks, updateTask, addObserver, removeObserver, getTaskObservers, getTaskActivityLog, taskValidationRules } from '../controllers/taskController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/projects/:projectId', authenticateToken, taskValidationRules(), validateRequest, createTask);
router.get('/projects/:projectId', authenticateToken, taskValidationRules(), validateRequest, getTasksByProject);
router.get('/my-tasks', authenticateToken, getMyTasks);
router.get('/:taskId', authenticateToken, taskValidationRules(), validateRequest, getTaskById);
router.put('/:taskId', authenticateToken, taskValidationRules(), validateRequest, updateTask);

router.post('/:taskId/observers', authenticateToken, taskValidationRules(), validateRequest, addObserver);
router.delete('/:taskId/observers/:userId', authenticateToken, taskValidationRules(), validateRequest, removeObserver);
router.get('/:taskId/observers', authenticateToken, taskValidationRules(), validateRequest, getTaskObservers);

router.get('/:taskId/activity-logs', authenticateToken, taskValidationRules(), validateRequest, getTaskActivityLog);

export default router;
