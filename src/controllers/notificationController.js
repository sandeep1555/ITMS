import { NotificationService } from '../services/notificationService.js';
import { param } from 'express-validator';

const notificationService = new NotificationService();

export const notificationValidationRules = () => [
  param('notificationId').isInt().optional()
];

export const getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const notifications = await notificationService.getNotifications(req.user.id, limit, offset);
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadNotificationsCount(req.user.id);
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.getNotificationById(notificationId, req.user.id);
    res.status(200).json({ notification });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await notificationService.markAsRead(notificationId, req.user.id);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId, req.user.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
