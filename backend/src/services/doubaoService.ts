import axios from 'axios';
import type { AIConcept, GenerateConceptsRequest } from '@/types';

const DOUBAO_CONFIG = {
  baseURL: process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/compatible',
  apiKey: process.env.DOUBAO_API_KEY || '',
  model: process.env.DOUBAO_MODEL || 'doubao-seed-1-6-thinking-code-preview',
};

interface DoubaoResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateConceptsWithDoubao = async (
  topic: string,
  count: number = 3
): Promise<AIConcept[]> => {
  try {
    if (!DOUBAO_CONFIG.apiKey) {
      throw new Error('豆包AI API密钥未配置');
    }

    const response = await axios.post<DoubaoResponse>(
      DOUBAO_CONFIG.baseURL,
      {
        model: DOUBAO_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: `你是一个智能学习助手，请根据用户输入的知识点，生成${count}个相关的知识点及其详细解释。
要求：
1. 每个知识点包含标题和2-3句中文核心解释
2. 知识点应具有逻辑性和关联性
3. 解释要专业、简洁、易懂
4. 避免使用复杂术语
5. 格式要求：严格返回JSON数组，每个元素包含title和summary字段，例如：
[{"title":"知识点1","summary":"解释内容"},{"title":"知识点2","summary":"解释内容"}]
6. 只返回JSON，不要添加其他任何说明文字`,
          },
          {
            role: 'user',
            content: `请生成与"${topic}"相关的${count}个知识点及其解释。`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_CONFIG.apiKey}`,
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('AI返回内容为空');
    }

    let concepts: AIConcept[];
    try {
      concepts = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON解析失败，AI返回内容:', content);
      throw new Error('AI返回格式错误');
    }

    if (!Array.isArray(concepts) || concepts.length === 0) {
      throw new Error('AI返回数据格式不正确');
    }

    // 确保返回指定数量的概念
    while (concepts.length < count) {
      const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
      concepts.push({ ...randomConcept });
    }

    return concepts.slice(0, count).map(concept => ({
      title: concept.title || `知识点 ${Math.random().toString(36).substr(2, 9)}`,
      summary: concept.summary || '暂无详细解释',
      difficulty: 'medium' as const,
    }));
  } catch (error) {
    console.error('豆包AI调用失败:', error);

    // 提供更详细的错误信息
    if (axios.isAxiosError(error)) {
      console.error('AI API错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.code === 'ECONNABORTED') {
        throw new Error('AI请求超时，请稍后重试');
      } else if (error.response?.status === 401) {
        throw new Error('AI API密钥无效');
      } else if (error.response?.status === 429) {
        throw new Error('AI请求过于频繁，请稍后重试');
      } else if (error.response?.status === 500) {
        throw new Error('AI服务内部错误，请稍后重试');
      }
    }

    // 降级到本地知识库
    return generateFallbackConcepts(topic, count);
  }
};

function generateFallbackConcepts(topic: string, count: number): AIConcept[] {
  const fallbackTemplates = [
    {
      title: `${topic}基础概念`,
      summary: `这是关于${topic}的核心基础概念，理解它对于掌握整个知识体系至关重要。`,
    },
    {
      title: `${topic}应用场景`,
      summary: `了解${topic}在实际中的应用场景，有助于将理论知识与实践相结合。`,
    },
    {
      title: `${topic}学习方法`,
      summary: `掌握有效的学习方法可以帮助你更快地理解和记忆${topic}相关知识。`,
    },
    {
      title: `${topic}关键要点`,
      summary: `${topic}的关键要点包括其定义、特点、分类和核心原则等方面。`,
    },
    {
      title: `${topic}相关概念对比`,
      summary: `将${topic}与其他相关概念进行对比，可以帮助你更好地理解它们之间的关系和区别。`,
    },
  ];

  const concepts: AIConcept[] = [];
  for (let i = 0; i < count; i++) {
    const template = fallbackTemplates[i % fallbackTemplates.length];
    concepts.push({
      ...template,
      title: i === 0 ? template.title : `${template.title} ${i + 1}`,
    });
  }

  return concepts;
}

export const analyzeLearningProgress = async (
  userId: string,
  courseId?: string
): Promise<any> => {
  // TODO: 实现学习进度分析功能
  return {
    totalCards: 0,
    masteredCards: 0,
    learningCards: 0,
    pendingCards: 0,
    masteryRate: 0,
    averageMasteryLevel: 0,
    studyStreak: 0,
    recentActivity: [],
  };
};

export const recommendReviewContent = async (
  userId: string,
  limit: number = 10
): Promise<any> => {
  // TODO: 实现复习内容推荐功能
  return {
    recommendedCards: [],
    focusAreas: [],
    studyTips: [],
    suggestedCourses: [],
  };
};