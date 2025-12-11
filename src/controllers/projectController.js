import { ProjectService } from '../services/projectService.js';
import { body, param } from 'express-validator';

const projectService = new ProjectService();

export const projectValidationRules = () => [
  body('name').isLength({ min: 3 }).notEmpty(),
  body('description').isLength({ min: 3 }).optional(),
  body('startDate').isISO8601().optional(),
  body('endDate').isISO8601().optional(),
  body('status').isIn(['active', 'archived', 'inactive']).optional(),
  body('userId').isInt().optional(),
  body('role').isIn(['lead', 'member']).optional(),
  param('projectId').isInt().optional(),
  param('userId').isInt().optional()
];

export const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = await projectService.createProject(name, description, req.user.id, startDate, endDate);
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.getProjectById(projectId);
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByUser(req.user.id);
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.updateProject(projectId, req.body);
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    next(error);
  }
};

export const addProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;
    const member = await projectService.addProjectMember(projectId, userId, role);
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (error) {
    next(error);
  }
};

export const removeProjectMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;
    await projectService.removeProjectMember(projectId, userId);
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProjectMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const members = await projectService.getProjectMembers(projectId);
    res.status(200).json({ members });
  } catch (error) {
    next(error);
  }
};
