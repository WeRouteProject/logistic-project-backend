import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

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

export const getDeliveryBoys = async (req, res) => {
  try{
    const deliveryBoys = await authService.getAllDeliveryBoys();
    res.status(200).json(deliveryBoys);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided, please log in again." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token, please log in again." });
      }

      return res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

