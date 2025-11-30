import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'mock-secret-key';

app.use(cors());
app.use(express.json());

// Mock data
let users = [];
let courses = [];
let knowledgeCards = [];
let inputHistory = [];

let nextUserId = 1;
let nextCourseId = 1;
let nextCardId = 1;
let nextHistoryId = 1;

// Middleware to mock authentication
const mockAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: '未提供认证token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: '无效的认证token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.userId, username: decoded.username };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: '无效的认证token' });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuralPrep Backend is running (Mock Mode)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    mode: 'mock'
  });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, learningStyle = 'visual' } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: existingUser.email === email ? '该邮箱已被注册' : '该用户名已被使用' });
    }

    // Hash password (mock)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      _id: nextUserId++,
      username,
      email,
      password: hashedPassword,
      learningStyle,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          learningStyle: user.learningStyle,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({ success: false, error: '用户不存在或已被禁用' });
    }

    // Verify password (mock)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: '密码错误' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          learningStyle: user.learningStyle,
          isActive: user.isActive
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/auth/me', mockAuth, (req, res) => {
  try {
    const user = users.find(u => u._id === req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        learningStyle: user.learningStyle,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Course endpoints
app.get('/api/courses', mockAuth, (req, res) => {
  try {
    const userCourses = courses.filter(course => course.userId === req.user._id);
    res.json({
      success: true,
      data: userCourses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/courses/stats', mockAuth, (req, res) => {
  try {
    const userCourses = courses.filter(course => course.userId === req.user._id);
    const userCards = knowledgeCards.filter(card => card.userId === req.user._id);

    const stats = userCourses.map(course => {
      const courseCards = userCards.filter(card => card.courseId === course._id);
      const masteredCount = courseCards.filter(card => card.status === 'mastered').length;
      const learningCount = courseCards.filter(card => card.status === 'learning').length;
      const notStartedCount = courseCards.filter(card => card.status === 'not_started').length;

      return {
        _id: course._id,
        name: course.name,
        cardCount: courseCards.length,
        masteredCount,
        learningCount,
        notStartedCount,
        progress: courseCards.length > 0 ? Math.round((masteredCount / courseCards.length) * 100) : 0
      };
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/courses', mockAuth, (req, res) => {
  try {
    const { name, description = '', color = '#10B981' } = req.body;

    // Check if course name exists for this user
    const existingCourse = courses.find(course =>
      course.name === name && course.userId === req.user._id
    );

    if (existingCourse) {
      return res.status(400).json({ success: false, error: '该课程名称已存在' });
    }

    const course = {
      _id: nextCourseId++,
      name,
      description,
      color,
      isActive: true,
      userId: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    courses.push(course);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Card endpoints

// Get single card
app.get('/api/cards/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const card = knowledgeCards.find(card => card._id === parseInt(id) && card.userId === req.user._id);

    if (!card) {
      return res.status(404).json({ success: false, error: '知识点卡片不存在' });
    }

    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Update card
app.put('/api/cards/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, courseId, difficulty = 'medium', tags = [] } = req.body;

    const cardIndex = knowledgeCards.findIndex(card => card._id === parseInt(id) && card.userId === req.user._id);

    if (cardIndex === -1) {
      return res.status(404).json({ success: false, error: '知识点卡片不存在' });
    }

    knowledgeCards[cardIndex] = {
      ...knowledgeCards[cardIndex],
      title,
      summary,
      content,
      courseId: courseId ? parseInt(courseId) : null,
      difficulty,
      tags,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: knowledgeCards[cardIndex],
      message: '知识点卡片已成功更新'
    });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Partial update card
app.patch('/api/cards/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const cardIndex = knowledgeCards.findIndex(card => card._id === parseInt(id) && card.userId === req.user._id);

    if (cardIndex === -1) {
      return res.status(404).json({ success: false, error: '知识点卡片不存在' });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['title', 'summary', 'content', 'courseId', 'difficulty', 'tags', 'status', 'masteryLevel'];
    const validUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'courseId' && updates[key] !== null) {
          validUpdates[key] = parseInt(updates[key]);
        } else {
          validUpdates[key] = updates[key];
        }
      }
    });

    knowledgeCards[cardIndex] = {
      ...knowledgeCards[cardIndex],
      ...validUpdates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: knowledgeCards[cardIndex],
      message: '知识点卡片已成功更新'
    });
  } catch (error) {
    console.error('Partial update card error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Delete card
app.delete('/api/cards/:id', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const cardIndex = knowledgeCards.findIndex(card => card._id === parseInt(id) && card.userId === req.user._id);

    if (cardIndex === -1) {
      return res.status(404).json({ success: false, error: '知识点卡片不存在' });
    }

    const deletedCard = knowledgeCards.splice(cardIndex, 1)[0];

    res.json({
      success: true,
      data: deletedCard,
      message: '知识点卡片已成功删除'
    });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Update card status
app.put('/api/cards/:id/status', mockAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, masteryLevel = 0, notes = '' } = req.body;

    const validStatuses = ['not_started', 'learning', 'reviewing', 'mastered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: '无效的状态值' });
    }

    const cardIndex = knowledgeCards.findIndex(card => card._id === parseInt(id) && card.userId === req.user._id);

    if (cardIndex === -1) {
      return res.status(404).json({ success: false, error: '知识点卡片不存在' });
    }

    knowledgeCards[cardIndex] = {
      ...knowledgeCards[cardIndex],
      status,
      masteryLevel: Math.max(0, Math.min(100, masteryLevel)),
      notes,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: knowledgeCards[cardIndex],
      message: '知识点状态已成功更新'
    });
  } catch (error) {
    console.error('Update card status error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// Get cards (existing endpoint)
app.get('/api/cards', mockAuth, (req, res) => {
  try {
    const { courseId, status, limit = 20, offset = 0 } = req.query;

    let userCards = knowledgeCards.filter(card => card.userId === req.user._id);

    if (courseId) {
      userCards = userCards.filter(card => card.courseId === parseInt(courseId));
    }

    if (status) {
      userCards = userCards.filter(card => card.status === status);
    }

    // Sort by createdAt descending
    userCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const paginatedCards = userCards.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: paginatedCards,
      pagination: {
        total: userCards.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < userCards.length
      }
    });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/cards/review', mockAuth, (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get cards that need review (simplified logic)
    let reviewCards = knowledgeCards.filter(card =>
      card.userId === req.user._id &&
      card.status !== 'mastered'
    );

    // Sort by status and createdAt
    reviewCards.sort((a, b) => {
      const statusOrder = { 'not_started': 0, 'learning': 1, 'reviewing': 2, 'mastered': 3 };
      return statusOrder[a.status] - statusOrder[b.status] || new Date(a.createdAt) - new Date(b.createdAt);
    });

    const limitedCards = reviewCards.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: limitedCards
    });
  } catch (error) {
    console.error('Get review cards error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/cards', mockAuth, (req, res) => {
  try {
    const { title, summary, content, courseId, difficulty = 'medium', tags = [] } = req.body;

    const card = {
      _id: nextCardId++,
      title,
      summary,
      content,
      difficulty,
      tags,
      relatedCards: [],
      status: 'not_started',
      masteryLevel: 0,
      userId: req.user._id,
      courseId: courseId ? parseInt(courseId) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    knowledgeCards.push(card);

    res.status(201).json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

// AI endpoints
app.post('/api/ai/generate-concepts', mockAuth, (req, res) => {
  try {
    const { topic, courseId, count = 3, save = false } = req.body;

    // Mock AI generated concepts
    const mockConcepts = [
      {
        title: `${topic} - 基本概念`,
        summary: `这是关于${topic}的基本概念介绍，涵盖了核心定义和基本原理。`,
        content: `详细内容：${topic}是一个重要的知识点，需要深入理解其基本概念和应用场景。`,
        difficulty: 'beginner',
        tags: [topic, '基础']
      },
      {
        title: `${topic} - 核心原理`,
        summary: `深入探讨${topic}的核心原理和工作机制。`,
        content: `详细内容：${topic}的核心原理包括多个关键要素，需要系统学习和实践。`,
        difficulty: 'intermediate',
        tags: [topic, '原理']
      },
      {
        title: `${topic} - 实际应用`,
        summary: `${topic}在实际场景中的应用案例和最佳实践。`,
        content: `详细内容：${topic}的应用非常广泛，包括多个行业和领域的实际案例。`,
        difficulty: 'advanced',
        tags: [topic, '应用']
      }
    ];

    let generatedConcepts = mockConcepts.slice(0, count);

    // Save to database if requested
    if (save) {
      generatedConcepts = generatedConcepts.map(concept => {
        const card = {
          _id: nextCardId++,
          ...concept,
          relatedCards: [],
          status: 'not_started',
          masteryLevel: 0,
          userId: req.user._id,
          courseId: courseId ? parseInt(courseId) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        knowledgeCards.push(card);
        return card;
      });
    }

    // Save to input history
    const history = {
      _id: nextHistoryId++,
      topic,
      response: generatedConcepts,
      userId: req.user._id,
      courseId: courseId ? parseInt(courseId) : null,
      createdAt: new Date()
    };

    inputHistory.push(history);

    res.json({
      success: true,
      data: generatedConcepts,
      message: save ? `成功生成并保存了 ${generatedConcepts.length} 个知识点` : `成功生成了 ${generatedConcepts.length} 个知识点`
    });
  } catch (error) {
    console.error('Generate concepts error:', error);
    res.status(500).json({ success: false, error: 'AI服务暂时不可用' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API端点不存在',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/courses',
      'GET /api/courses/stats',
      'POST /api/courses',
      'GET /api/cards',
      'GET /api/cards/:id',
      'GET /api/cards/review',
      'POST /api/cards',
      'PUT /api/cards/:id',
      'PATCH /api/cards/:id',
      'DELETE /api/cards/:id',
      'PUT /api/cards/:id/status',
      'POST /api/ai/generate-concepts'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 NeuralPrep Mock Backend 服务器已启动');
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log(`🌱 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log('📚 API端点:');
  console.log('   - GET  /api/health - 健康检查');
  console.log('   - POST /api/auth/register - 用户注册');
  console.log('   - POST /api/auth/login - 用户登录');
  console.log('   - GET  /api/courses - 获取课程列表');
  console.log('   - POST /api/courses - 创建课程');
  console.log('   - GET  /api/cards - 获取知识点卡片');
  console.log('   - GET  /api/cards/:id - 获取单个知识点卡片');
  console.log('   - PUT  /api/cards/:id - 更新知识点卡片');
  console.log('   - PATCH /api/cards/:id - 部分更新知识点卡片');
  console.log('   - DELETE /api/cards/:id - 删除知识点卡片');
  console.log('   - PUT  /api/cards/:id/status - 更新知识点状态');
  console.log('   - POST /api/ai/generate-concepts - 生成知识点');
  console.log('✨ Mock服务已准备就绪，可以开始使用！');
});
