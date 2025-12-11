import express from 'express';
import { register, login, getProfile, authValidationRules } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authValidationRules(), validateRequest, register);
router.post('/login', authValidationRules(), validateRequest, login);
router.get('/profile', authenticateToken, getProfile);

export default router;
