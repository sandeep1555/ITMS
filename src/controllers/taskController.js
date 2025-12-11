import { TaskService } from '../services/taskService.js';
import { body, param } from 'express-validator';

const taskService = new TaskService();

export const taskValidationRules = () => [
  body('title').isLength({ min: 3 }).notEmpty(),
  body('description').isLength({ min: 3 }).optional(),
  body('assigneeId').isInt().optional(),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).optional(),
  body('status').isIn(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  body('dueDate').isISO8601().optional(),
  body('userId').isInt().optional(),
  param('taskId').isInt().optional(),
  param('projectId').isInt().optional()
];

export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assigneeId, priority, dueDate } = req.body;
    const task = await taskService.createTask(projectId, title, description, assigneeId, req.user.id, priority, dueDate);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await taskService.getTaskById(taskId);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const tasks = await taskService.getTasksByProject(projectId);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByAssignee(req.user.id);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await taskService.updateTask(taskId, req.user.id, req.body);
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
};

export const addObserver = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const observer = await taskService.addObserver(taskId, userId, req.user.id);
    res.status(201).json({ message: 'Observer added successfully', observer });
  } catch (error) {
    next(error);
  }
};

export const removeObserver = async (req, res, next) => {
  try {
    const { taskId, userId } = req.params;
    await taskService.removeObserver(taskId, userId, req.user.id);
    res.status(200).json({ message: 'Observer removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getTaskObservers = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const observers = await taskService.getTaskObservers(taskId);
    res.status(200).json({ observers });
  } catch (error) {
    next(error);
  }
};

export const getTaskActivityLog = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const logs = await taskService.getTaskActivityLog(taskId);
    res.status(200).json({ logs });
  } catch (error) {
    next(error);
  }
};
