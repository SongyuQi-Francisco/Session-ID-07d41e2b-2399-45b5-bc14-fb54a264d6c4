import express from 'express';
import {
  createNewCourse,
  getUserCourses,
  getCourse,
  updateExistingCourse,
  deleteExistingCourse,
  getCourseStats,
} from '@/controllers/courseController';
import { authenticate } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validate';
import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

class CreateCourseDto {
  @IsString()
  @MaxLength(50, { message: '课程名称不能超过50个字符' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '课程描述不能超过200个字符' })
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: '请输入有效的十六进制颜色代码' })
  color?: string;
}

class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '课程名称不能超过50个字符' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '课程描述不能超过200个字符' })
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: '请输入有效的十六进制颜色代码' })
  color?: string;

  @IsOptional()
  isActive?: boolean;
}

const router = express.Router();

router.get('/', authenticate, getUserCourses);

router.get('/stats', authenticate, getCourseStats);

router.post(
  '/',
  authenticate,
  validateRequest(CreateCourseDto),
  createNewCourse
);

router.get('/:courseId', authenticate, getCourse);

router.put(
  '/:courseId',
  authenticate,
  validateRequest(UpdateCourseDto, { skipMissingProperties: true }),
  updateExistingCourse
);

router.delete('/:courseId', authenticate, deleteExistingCourse);

export default router;