import { Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeader } from '@/utils/jwt';
import type { ApiResponse } from '@/types';

export const authenticate = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: '缺少认证token',
      });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: '无效的认证token',
      });
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: '用户不存在或已被禁用',
      });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: '认证失败',
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      next();
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      next();
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id.toString();
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};