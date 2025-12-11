import express from 'express';
import { createProject, getProjectById, getAllProjects, getMyProjects, updateProject, addProjectMember, removeProjectMember, getProjectMembers, projectValidationRules } from '../controllers/projectController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, projectValidationRules(), validateRequest, createProject);
router.get('/', authenticateToken, authorize('admin'), getAllProjects);
router.get('/my-projects', authenticateToken, getMyProjects);
router.get('/:projectId', authenticateToken, projectValidationRules(), validateRequest, getProjectById);
router.put('/:projectId', authenticateToken, projectValidationRules(), validateRequest, updateProject);

router.post('/:projectId/members', authenticateToken, projectValidationRules(), validateRequest, addProjectMember);
router.delete('/:projectId/members/:userId', authenticateToken, projectValidationRules(), validateRequest, removeProjectMember);
router.get('/:projectId/members', authenticateToken, projectValidationRules(), validateRequest, getProjectMembers);

export default router;
