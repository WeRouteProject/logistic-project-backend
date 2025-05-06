import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ExistingUser = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [bearer, token] = headerToken.split(' ');

  if (bearer?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: user.userId,
      role: user.role,
      email: user.email
    }; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export default ExistingUser;
