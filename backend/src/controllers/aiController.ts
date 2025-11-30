import { Request, Response } from 'express';
import {
  generateConceptsWithDoubao,
  analyzeLearningProgress,
  recommendReviewContent,
} from '@/services/doubaoService';
import KnowledgeCard from '@/models/KnowledgeCard';
import InputHistory from '@/models/InputHistory';
import type { ApiResponse, GenerateConceptsRequest } from '@/types';

export const generateConcepts = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { topic, courseId, count = 3 } = req.body as GenerateConceptsRequest;

    if (!topic || topic.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: '知识点主题不能为空',
      });
      return;
    }

    // 记录输入历史
    const inputHistory = new InputHistory({
      userId: req.userId,
      courseId: courseId || undefined,
      topic: topic.trim(),
    });

    let concepts;
    let aiError = null;

    try {
      concepts = await generateConceptsWithDoubao(topic.trim(), count);
      inputHistory.response = {
        success: true,
        concepts,
        timestamp: new Date(),
      };
    } catch (error) {
      aiError = error instanceof Error ? error.message : 'AI生成失败';
      console.error('AI generate concepts error:', error);

      // 返回降级结果
      res.status(206).json({
        success: false,
        error: aiError,
        message: 'AI服务暂时不可用，使用本地知识库',
        data: {
          concepts: generateFallbackConcepts(topic.trim(), count),
        },
      });

      inputHistory.response = {
        success: false,
        error: aiError,
        timestamp: new Date(),
      };

      await inputHistory.save();
      return;
    }

    // 保存成功的历史记录
    await inputHistory.save();

    // 如果用户要求保存到数据库
    const shouldSave = req.query.save === 'true';
    let savedCards = [];

    if (shouldSave) {
      savedCards = await Promise.all(
        concepts.map(async (concept) => {
          const card = new KnowledgeCard({
            userId: req.userId,
            courseId: courseId || undefined,
            title: concept.title,
            summary: concept.summary,
            difficulty: concept.difficulty || 'medium',
            tags: extractTagsFromConcept(concept.title, concept.summary),
          });

          await card.save();
          return card;
        })
      );
    }

    res.status(200).json({
      success: true,
      data: {
        concepts,
        savedCards: shouldSave ? savedCards : null,
      },
      message: shouldSave ? '知识点生成并保存成功' : '知识点生成成功',
    });
  } catch (error) {
    console.error('Generate concepts error:', error);
    res.status(500).json({
      success: false,
      error: '生成知识点失败',
    });
  }
};

export const analyzeProgress = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { courseId } = req.query;

    const analysis = await analyzeLearningProgress(req.userId, courseId as string);

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analyze progress error:', error);
    res.status(500).json({
      success: false,
      error: '分析学习进度失败',
    });
  }
};

export const recommendReview = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;

    const recommendations = await recommendReviewContent(req.userId, limit);

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Recommend review error:', error);
    res.status(500).json({
      success: false,
      error: '获取复习推荐失败',
    });
  }
};

export const getInputHistory = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { courseId } = req.query;

    const query: any = { userId: req.userId };
    if (courseId) {
      query.courseId = courseId;
    }

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      InputHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('course', 'name color')
        .lean(),
      InputHistory.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get input history error:', error);
    res.status(500).json({
      success: false,
      error: '获取输入历史失败',
    });
  }
};

function generateFallbackConcepts(topic: string, count: number) {
  const fallbackTemplates = [
    {
      title: `${topic}基础概念`,
      summary: `这是关于${topic}的核心基础概念，理解它对于掌握整个知识体系至关重要。`,
      difficulty: 'easy',
    },
    {
      title: `${topic}应用场景`,
      summary: `了解${topic}在实际中的应用场景，有助于将理论知识与实践相结合。`,
      difficulty: 'medium',
    },
    {
      title: `${topic}学习方法`,
      summary: `掌握有效的学习方法可以帮助你更快地理解和记忆${topic}相关知识。`,
      difficulty: 'easy',
    },
    {
      title: `${topic}关键要点`,
      summary: `${topic}的关键要点包括其定义、特点、分类和核心原则等方面。`,
      difficulty: 'medium',
    },
    {
      title: `${topic}相关概念对比`,
      summary: `将${topic}与其他相关概念进行对比，可以帮助你更好地理解它们之间的关系和区别。`,
      difficulty: 'hard',
    },
  ];

  const concepts = [];
  for (let i = 0; i < count; i++) {
    const template = fallbackTemplates[i % fallbackTemplates.length];
    concepts.push({
      ...template,
      title: i === 0 ? template.title : `${template.title} ${i + 1}`,
    });
  }

  return concepts;
}

function extractTagsFromConcept(title: string, summary: string): string[] {
  const text = `${title} ${summary}`;
  const words = text.split(/[^a-zA-Z0-9\u4e00-\u9fa5]+/).filter(word => word.length > 1);

  const tags = new Set<string>();

  // 提取可能的关键词
  for (const word of words) {
    if (word.length >= 2 && word.length <= 10) {
      tags.add(word);
      if (tags.size >= 5) break;
    }
  }

  return Array.from(tags).slice(0, 5);
}