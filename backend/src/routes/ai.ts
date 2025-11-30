import express from 'express';
import {
  generateConcepts,
  analyzeProgress,
  recommendReview,
  getInputHistory,
} from '@/controllers/aiController';
import { authenticate } from '@/middleware/auth';
import { aiRateLimiter, generalRateLimiter } from '@/middleware/rateLimit';
import { validateRequest } from '@/middleware/validate';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

class GenerateConceptsDto {
  @IsString()
  @Min(1, { message: '知识点主题至少1个字符' })
  topic!: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: '生成数量至少1个' })
  @Max(10, { message: '生成数量最多10个' })
  count?: number;
}

const router = express.Router();

router.post(
  '/generate-concepts',
  authenticate,
  aiRateLimiter,
  validateRequest(GenerateConceptsDto),
  generateConcepts
);

router.get(
  '/analyze-progress',
  authenticate,
  generalRateLimiter,
  analyzeProgress
);

router.get(
  '/recommend-review',
  authenticate,
  generalRateLimiter,
  recommendReview
);

router.get(
  '/input-history',
  authenticate,
  generalRateLimiter,
  getInputHistory
);

export default router;