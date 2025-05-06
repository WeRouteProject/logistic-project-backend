import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.status(200).json({ message: 'Login successful', ...data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
