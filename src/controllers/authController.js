import { AuthService } from '../services/authService.js';
import { body } from 'express-validator';

const authService = new AuthService();

export const authValidationRules = () => [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3 }).optional(),
  body('firstName').isLength({ min: 2 }).optional(),
  body('lastName').isLength({ min: 2 }).optional()
];

export const register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await authService.register(username, email, password, firstName, lastName);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
