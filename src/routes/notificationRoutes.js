import express from 'express';
import { getNotifications, getUnreadCount, getNotificationById, markAsRead, markAllAsRead, deleteNotification, notificationValidationRules } from '../controllers/notificationController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread/count', authenticateToken, getUnreadCount);
router.get('/:notificationId', authenticateToken, notificationValidationRules(), validateRequest, getNotificationById);
router.put('/:notificationId/read', authenticateToken, notificationValidationRules(), validateRequest, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);
router.delete('/:notificationId', authenticateToken, notificationValidationRules(), validateRequest, deleteNotification);

export default router;
