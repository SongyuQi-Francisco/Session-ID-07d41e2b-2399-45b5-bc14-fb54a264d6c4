import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import type { ApiResponse } from '@/types';

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15分钟
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');

export const createRateLimiter = (
  windowMs: number = RATE_LIMIT_WINDOW_MS,
  max: number = RATE_LIMIT_MAX,
  message: string = '请求过于频繁，请稍后再试'
) => {
  return rateLimit({
    windowMs,
    max,
    handler: (req: Request, res: Response<ApiResponse>) => {
      res.status(429).json({
        success: false,
        error: message,
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const generalRateLimiter = createRateLimiter();

export const strictRateLimiter = createRateLimiter(
  60000, // 1分钟
  10, // 最多10次请求
  '请求过于频繁，请稍后再试'
);

export const authRateLimiter = createRateLimiter(
  300000, // 5分钟
  5, // 最多5次请求
  '认证请求过于频繁，请稍后再试'
);

export const aiRateLimiter = createRateLimiter(
  60000, // 1分钟
  3, // 最多3次请求
  'AI请求过于频繁，请稍后再试'
);