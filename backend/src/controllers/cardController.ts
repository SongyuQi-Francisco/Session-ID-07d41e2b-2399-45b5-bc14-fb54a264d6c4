import { Request, Response } from 'express';
import {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
  updateCardStatus,
  batchUpdateCardStatus,
  getCardsForReview,
} from '@/services/cardService';
import type { ApiResponse } from '@/types';

export const createNewCard = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { title, summary, courseId, content, difficulty, tags, relatedCards } = req.body;

    const card = await createCard(req.userId, {
      title,
      summary,
      courseId,
      content,
      difficulty,
      tags,
      relatedCards,
    });

    res.status(201).json({
      success: true,
      data: card,
      message: '知识点卡片创建成功',
    });
  } catch (error) {
    console.error('Create card error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '创建知识点卡片失败',
    });
  }
};

export const getUserCards = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || '-createdAt';
    const courseId = (req.query.courseId as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const difficulty = (req.query.difficulty as string) || undefined;

    const result = await getCards(
      req.userId,
      { page, limit, sort },
      { courseId, status, difficulty }
    );

    res.status(200).json({
      success: true,
      data: result.cards,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({
      success: false,
      error: '获取知识点卡片列表失败',
    });
  }
};

export const getCard = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { cardId } = req.params;

    const card = await getCardById(req.userId, cardId);

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : '获取知识点卡片失败',
    });
  }
};

export const updateExistingCard = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { cardId } = req.params;
    const { title, summary, content, status, difficulty, tags, relatedCards } = req.body;

    const card = await updateCard(req.userId, cardId, {
      title,
      summary,
      content,
      status,
      difficulty,
      tags,
      relatedCards,
    });

    res.status(200).json({
      success: true,
      data: card,
      message: '知识点卡片更新成功',
    });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '更新知识点卡片失败',
    });
  }
};

export const deleteExistingCard = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { cardId } = req.params;

    const result = await deleteCard(req.userId, cardId);

    res.status(200).json({
      success: true,
      data: result,
      message: '知识点卡片删除成功',
    });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : '删除知识点卡片失败',
    });
  }
};

export const updateCardStatusHandler = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { cardId } = req.params;
    const { status, masteryLevel, notes } = req.body;

    const result = await updateCardStatus(req.userId, cardId, {
      status,
      masteryLevel,
      notes,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: '知识点卡片状态更新成功',
    });
  } catch (error) {
    console.error('Update card status error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '更新知识点卡片状态失败',
    });
  }
};

export const batchUpdateCardStatusHandler = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { cardIds, status } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      res.status(400).json({
        success: false,
        error: '请提供要更新的卡片ID列表',
      });
      return;
    }

    const result = await batchUpdateCardStatus(req.userId, cardIds, status);

    res.status(200).json({
      success: true,
      data: result,
      message: `成功更新${result.updatedCount}张卡片状态`,
    });
  } catch (error) {
    console.error('Batch update card status error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '批量更新卡片状态失败',
    });
  }
};

export const getReviewCards = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;

    const cards = await getCardsForReview(req.userId, limit);

    res.status(200).json({
      success: true,
      data: cards,
      message: `获取到${cards.length}张推荐复习卡片`,
    });
  } catch (error) {
    console.error('Get review cards error:', error);
    res.status(500).json({
      success: false,
      error: '获取推荐复习卡片失败',
    });
  }
};

export const getCardStats = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { courseId } = req.query;

    const query: any = { userId: req.userId };
    if (courseId) {
      query.courseId = courseId;
    }

    const [total, mastered, learning, pending, easy, medium, hard] = await Promise.all([
      KnowledgeCard.countDocuments(query),
      KnowledgeCard.countDocuments({ ...query, status: 'mastered' }),
      KnowledgeCard.countDocuments({ ...query, status: 'learning' }),
      KnowledgeCard.countDocuments({ ...query, status: 'pending' }),
      KnowledgeCard.countDocuments({ ...query, difficulty: 'easy' }),
      KnowledgeCard.countDocuments({ ...query, difficulty: 'medium' }),
      KnowledgeCard.countDocuments({ ...query, difficulty: 'hard' }),
    ]);

    const masteryRate = total > 0 ? Math.round((mastered / total) * 100) : 0;

    const stats = {
      total,
      mastered,
      learning,
      pending,
      easy,
      medium,
      hard,
      masteryRate,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get card stats error:', error);
    res.status(500).json({
      success: false,
      error: '获取知识点卡片统计失败',
    });
  }
};