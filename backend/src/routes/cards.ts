import express from 'express';
import {
  createNewCard,
  getUserCards,
  getCard,
  updateExistingCard,
  deleteExistingCard,
  updateCardStatusHandler,
  batchUpdateCardStatusHandler,
  getReviewCards,
  getCardStats,
} from '@/controllers/cardController';
import { authenticate } from '@/middleware/auth';
import { generalRateLimiter } from '@/middleware/rateLimit';
import { validateRequest } from '@/middleware/validate';
import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

class CreateCardDto {
  @IsString()
  @MaxLength(100, { message: '知识点标题不能超过100个字符' })
  title!: string;

  @IsString()
  @MaxLength(500, { message: '知识点摘要不能超过500个字符' })
  summary!: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'], {
    message: '难度级别必须是easy、medium或hard',
  })
  difficulty?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedCards?: string[];
}

class UpdateCardDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '知识点标题不能超过100个字符' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '知识点摘要不能超过500个字符' })
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['pending', 'mastered', 'learning'], {
    message: '状态必须是pending、mastered或learning',
  })
  status?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'], {
    message: '难度级别必须是easy、medium或hard',
  })
  difficulty?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedCards?: string[];
}

class UpdateCardStatusDto {
  @IsOptional()
  @IsIn(['pending', 'mastered', 'learning'], {
    message: '状态必须是pending、mastered或learning',
  })
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: '掌握程度不能小于0' })
  @Max(100, { message: '掌握程度不能大于100' })
  masteryLevel?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '笔记不能超过500个字符' })
  notes?: string;
}

class BatchUpdateCardStatusDto {
  @IsArray()
  @IsString({ each: true })
  cardIds!: string[];

  @IsIn(['pending', 'mastered', 'learning'], {
    message: '状态必须是pending、mastered或learning',
  })
  status!: string;
}

const router = express.Router();

router.get('/', authenticate, generalRateLimiter, getUserCards);

router.get('/stats', authenticate, generalRateLimiter, getCardStats);

router.get('/review', authenticate, generalRateLimiter, getReviewCards);

router.post(
  '/',
  authenticate,
  generalRateLimiter,
  validateRequest(CreateCardDto),
  createNewCard
);

router.get('/:cardId', authenticate, generalRateLimiter, getCard);

router.put(
  '/:cardId',
  authenticate,
  generalRateLimiter,
  validateRequest(UpdateCardDto, { skipMissingProperties: true }),
  updateExistingCard
);

router.put(
  '/:cardId/status',
  authenticate,
  generalRateLimiter,
  validateRequest(UpdateCardStatusDto, { skipMissingProperties: true }),
  updateCardStatusHandler
);

router.put(
  '/batch/update-status',
  authenticate,
  generalRateLimiter,
  validateRequest(BatchUpdateCardStatusDto),
  batchUpdateCardStatusHandler
);

router.delete('/:cardId', authenticate, generalRateLimiter, deleteExistingCard);

export default router;