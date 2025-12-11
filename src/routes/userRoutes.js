import express from 'express';
import { getAllUsers, getUserById, updateUser, updateUserRole, deactivateUser, reactivateUser, userValidationRules } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, authorize('admin'), getAllUsers);
router.get('/:userId', authenticateToken, userValidationRules(), validateRequest, getUserById);
router.put('/:userId', authenticateToken, userValidationRules(), validateRequest, updateUser);
router.put('/:userId/role', authenticateToken, authorize('admin'), userValidationRules(), validateRequest, updateUserRole);
router.put('/:userId/deactivate', authenticateToken, authorize('admin'), deactivateUser);
router.put('/:userId/reactivate', authenticateToken, authorize('admin'), reactivateUser);

export default router;
