import { SubtaskService } from '../services/subtaskService.js';
import { body, param } from 'express-validator';

const subtaskService = new SubtaskService();

export const subtaskValidationRules = () => [
  body('title').isLength({ min: 3 }).notEmpty(),
  body('description').isLength({ min: 3 }).optional(),
  body('assigneeId').isInt().optional(),
  body('priority').isIn(['low', 'medium', 'high']).optional(),
  body('status').isIn(['open', 'in_progress', 'completed']).optional(),
  body('dueDate').isISO8601().optional(),
  param('subtaskId').isInt().optional(),
  param('taskId').isInt().optional()
];

export const createSubtask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, assigneeId, priority, dueDate } = req.body;
    const subtask = await subtaskService.createSubtask(taskId, title, description, assigneeId, priority, dueDate);
    res.status(201).json({ message: 'Subtask created successfully', subtask });
  } catch (error) {
    next(error);
  }
};

export const getSubtaskById = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    const subtask = await subtaskService.getSubtaskById(subtaskId);
    res.status(200).json({ subtask });
  } catch (error) {
    next(error);
  }
};

export const getSubtasksByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const subtasks = await subtaskService.getSubtasksByTask(taskId);
    res.status(200).json({ subtasks });
  } catch (error) {
    next(error);
  }
};

export const updateSubtask = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    const subtask = await subtaskService.updateSubtask(subtaskId, req.body);
    res.status(200).json({ message: 'Subtask updated successfully', subtask });
  } catch (error) {
    next(error);
  }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    const { subtaskId } = req.params;
    await subtaskService.deleteSubtask(subtaskId);
    res.status(200).json({ message: 'Subtask deleted successfully' });
  } catch (error) {
    next(error);
  }
};
