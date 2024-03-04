import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  const token = authorizationHeader.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Unauthorized - Invalid token' });
    }

    // Check if the user exists in the database
    const dbUser = await User.findByPk(user.id);
    if (!dbUser) {
      return res.status(403).json({ error: 'Unauthorized - User not found' });
    }

    req.user = dbUser;

    next();
  });
};

export default authMiddleware;
