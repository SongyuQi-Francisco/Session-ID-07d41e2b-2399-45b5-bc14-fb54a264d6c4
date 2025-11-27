import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string, username: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    username,
    email,
    iat: Date.now(),
    exp: Date.now() + parseInt(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  };

  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.warn('JWT verification failed:', error);
    return null;
  }
};

export const extractTokenFromHeader = (header: string | undefined): string | null => {
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.substring(7);
};