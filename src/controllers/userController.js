import { UserService } from '../services/userService.js';
import { body, param } from 'express-validator';

const userService = new UserService();

export const userValidationRules = () => [
  body('firstName').isLength({ min: 2 }).optional(),
  body('lastName').isLength({ min: 2 }).optional(),
  body('email').isEmail().normalizeEmail().optional(),
  body('roleId').isInt().optional(),
  param('userId').isInt()
];

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.updateUser(userId, req.body);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;
    const user = await userService.updateUserRole(userId, roleId);
    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.deactivateUser(userId);
    res.status(200).json({ message: 'User deactivated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.reactivateUser(userId);
    res.status(200).json({ message: 'User reactivated successfully', user });
  } catch (error) {
    next(error);
  }
};
