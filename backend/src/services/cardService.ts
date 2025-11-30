import KnowledgeCard from '@/models/KnowledgeCard';
import LearningProgress from '@/models/LearningProgress';
import type {
  KnowledgeCardCreateInput,
  KnowledgeCardUpdateInput,
  PaginationOptions,
  LearningProgressUpdateInput,
} from '@/types';

export const createCard = async (userId: string, cardData: KnowledgeCardCreateInput) => {
  const {
    title,
    summary,
    courseId,
    content,
    difficulty = 'medium',
    tags = [],
    relatedCards = [],
  } = cardData;

  const existingCard = await KnowledgeCard.findOne({
    userId,
    title,
    isActive: true,
  });

  if (existingCard) {
    throw new Error('该知识点标题已存在');
  }

  const card = new KnowledgeCard({
    userId,
    courseId: courseId || undefined,
    title,
    summary,
    content: content || '',
    difficulty,
    tags,
    relatedCards,
  });

  await card.save();

  // 为新卡片创建学习进度记录
  const progress = new LearningProgress({
    userId,
    cardId: card._id,
    courseId: courseId || undefined,
    masteryLevel: 0,
    lastReviewed: new Date(),
    reviewCount: 0,
  });

  await progress.save();

  // 关联进度记录到卡片
  card.progress = progress;

  return card;
};

export const getCards = async (
  userId: string,
  options: PaginationOptions = {},
  filters: {
    courseId?: string;
    status?: string;
    difficulty?: string;
  } = {}
) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const { courseId, status, difficulty } = filters;

  const query: any = {
    userId,
  };

  if (courseId) {
    query.courseId = courseId;
  }

  if (status) {
    query.status = status;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  const skip = (page - 1) * limit;

  const [cards, total] = await Promise.all([
    KnowledgeCard.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('course', 'name color')
      .populate('progress', 'masteryLevel lastReviewed reviewCount nextReviewDate')
      .lean(),
    KnowledgeCard.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    cards,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getCardById = async (userId: string, cardId: string) => {
  const card = await KnowledgeCard.findOne({
    _id: cardId,
    userId,
  })
    .populate('course', 'name color')
    .populate('progress', 'masteryLevel lastReviewed reviewCount nextReviewDate notes')
    .populate('relatedCards', 'title summary status difficulty');

  if (!card) {
    throw new Error('知识点卡片不存在');
  }

  return card;
};

export const updateCard = async (
  userId: string,
  cardId: string,
  cardData: KnowledgeCardUpdateInput
) => {
  const { title, summary, content, status, difficulty, tags, relatedCards } = cardData;

  if (title) {
    const existingCard = await KnowledgeCard.findOne({
      _id: { $ne: cardId },
      userId,
      title,
    });

    if (existingCard) {
      throw new Error('该知识点标题已存在');
    }
  }

  const card = await KnowledgeCard.findOneAndUpdate(
    {
      _id: cardId,
      userId,
    },
    { title, summary, content, status, difficulty, tags, relatedCards },
    { new: true, runValidators: true }
  )
    .populate('course', 'name color')
    .populate('progress', 'masteryLevel lastReviewed reviewCount nextReviewDate');

  if (!card) {
    throw new Error('知识点卡片不存在');
  }

  return card;
};

export const deleteCard = async (userId: string, cardId: string) => {
  const card = await KnowledgeCard.findOne({
    _id: cardId,
    userId,
  });

  if (!card) {
    throw new Error('知识点卡片不存在');
  }

  await card.remove();

  return {
    message: '知识点卡片已删除',
    cardId,
  };
};

export const updateCardStatus = async (
  userId: string,
  cardId: string,
  statusData: {
    status?: string;
    masteryLevel?: number;
    notes?: string;
  }
) => {
  const { status, masteryLevel, notes } = statusData;

  const card = await KnowledgeCard.findOne({
    _id: cardId,
    userId,
  });

  if (!card) {
    throw new Error('知识点卡片不存在');
  }

  // 更新卡片状态
  if (status) {
    card.status = status;
    await card.save();
  }

  // 更新学习进度
  let progress = await LearningProgress.findOne({
    userId,
    cardId,
  });

  if (!progress) {
    progress = new LearningProgress({
      userId,
      cardId,
      courseId: card.courseId,
      masteryLevel: masteryLevel || 0,
      lastReviewed: new Date(),
      reviewCount: 1,
      notes: notes || '',
    });
  } else {
    if (masteryLevel !== undefined) {
      progress.masteryLevel = masteryLevel;
    }
    if (notes !== undefined) {
      progress.notes = notes;
    }
    progress.lastReviewed = new Date();
    progress.reviewCount += 1;
  }

  await progress.save();

  // 关联进度记录到卡片
  card.progress = progress;

  return {
    card,
    progress,
  };
};

export const batchUpdateCardStatus = async (
  userId: string,
  cardIds: string[],
  status: string
) => {
  const updatedCards = await KnowledgeCard.updateMany(
    {
      _id: { $in: cardIds },
      userId,
    },
    { status },
    { new: true }
  );

  // 为每个卡片更新学习进度
  await Promise.all(
    cardIds.map(async (cardId) => {
      const progress = await LearningProgress.findOne({
        userId,
        cardId,
      });

      if (progress) {
        progress.lastReviewed = new Date();
        progress.reviewCount += 1;
        if (status === 'mastered') {
          progress.masteryLevel = Math.max(progress.masteryLevel, 80);
        } else if (status === 'learning') {
          progress.masteryLevel = Math.max(progress.masteryLevel, 40);
        }
        await progress.save();
      }
    })
  );

  return {
    updatedCount: updatedCards.modifiedCount,
    matchedCount: updatedCards.matchedCount,
  };
};

export const getCardsForReview = async (userId: string, limit: number = 10) => {
  const now = new Date();

  const cards = await KnowledgeCard.aggregate([
    {
      $match: {
        userId,
        status: { $in: ['learning', 'pending'] },
      },
    },
    {
      $lookup: {
        from: 'learningprogresses',
        localField: '_id',
        foreignField: 'cardId',
        as: 'progress',
      },
    },
    {
      $unwind: {
        path: '$progress',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        priority: {
          $cond: {
            if: '$progress.nextReviewDate',
            then: {
              $cond: {
                if: { $lte: ['$progress.nextReviewDate', now] },
                then: 1,
                else: {
                  $divide: [
                    { $subtract: [now, '$progress.nextReviewDate'] },
                    86400000, // 24小时毫秒数
                  ],
                },
              },
            },
            else: 1,
          },
        },
      },
    },
    {
      $sort: {
        priority: -1,
        'progress.masteryLevel': 1,
        createdAt: 1,
      },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: {
        path: '$course',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  return cards;
};