import express from 'express';
import { createSubtask, getSubtaskById, getSubtasksByTask, updateSubtask, deleteSubtask, subtaskValidationRules } from '../controllers/subtaskController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/tasks/:taskId', authenticateToken, subtaskValidationRules(), validateRequest, createSubtask);
router.get('/tasks/:taskId', authenticateToken, subtaskValidationRules(), validateRequest, getSubtasksByTask);
router.get('/:subtaskId', authenticateToken, subtaskValidationRules(), validateRequest, getSubtaskById);
router.put('/:subtaskId', authenticateToken, subtaskValidationRules(), validateRequest, updateSubtask);
router.delete('/:subtaskId', authenticateToken, subtaskValidationRules(), validateRequest, deleteSubtask);

export default router;
