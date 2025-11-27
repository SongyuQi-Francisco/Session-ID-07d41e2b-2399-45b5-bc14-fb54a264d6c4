import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  deactivateCurrentUser,
} from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { authRateLimiter } from '@/middleware/rateLimit';
import { validateRequest } from '@/middleware/validate';
import { IsString, IsOptional, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

class RegisterDto {
  @IsString()
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(30, { message: '用户名不能超过30个字符' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username!: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  password!: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(visual|auditory|reading|kinesthetic)$/, {
    message: '学习风格必须是visual、auditory、reading或kinesthetic',
  })
  learningStyle?: string;
}

class LoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email!: string;

  @IsString()
  password!: string;
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(30, { message: '用户名不能超过30个字符' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(visual|auditory|reading|kinesthetic)$/, {
    message: '学习风格必须是visual、auditory、reading或kinesthetic',
  })
  learningStyle?: string;
}

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  validateRequest(RegisterDto),
  register
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest(LoginDto),
  login
);

router.get(
  '/me',
  authenticate,
  getCurrentUser
);

router.put(
  '/me',
  authenticate,
  validateRequest(UpdateUserDto, { skipMissingProperties: true }),
  updateCurrentUser
);

router.delete(
  '/me',
  authenticate,
  deactivateCurrentUser
);

export default router;