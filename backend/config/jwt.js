import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '7d';
const JWT_EXPIRES_IN_REMEMBER = '30d';

export const generateToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? JWT_EXPIRES_IN_REMEMBER : JWT_EXPIRES_IN;
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
