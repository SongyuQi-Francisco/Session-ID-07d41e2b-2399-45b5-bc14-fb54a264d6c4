import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import authRoutes from '@/routes/auth';
import courseRoutes from '@/routes/courses';
import cardRoutes from '@/routes/cards';
import aiRoutes from '@/routes/ai';
import { generalRateLimiter } from '@/middleware/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: CORS_ORIGIN.split(','),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(helmet());

app.use(generalRateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.info(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuralPrep Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API端点不存在',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PUT /api/auth/me',
      'DELETE /api/auth/me',
      'GET /api/courses',
      'GET /api/courses/stats',
      'POST /api/courses',
      'GET /api/courses/:courseId',
      'PUT /api/courses/:courseId',
      'DELETE /api/courses/:courseId',
      'GET /api/cards',
      'GET /api/cards/stats',
      'GET /api/cards/review',
      'POST /api/cards',
      'GET /api/cards/:cardId',
      'PUT /api/cards/:cardId',
      'PUT /api/cards/:cardId/status',
      'PUT /api/cards/batch/update-status',
      'DELETE /api/cards/:cardId',
      'POST /api/ai/generate-concepts',
      'GET /api/ai/analyze-progress',
      'GET /api/ai/recommend-review',
      'GET /api/ai/input-history',
    ],
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.info('🚀 NeuralPrep Backend 服务器已启动');
      console.info(`📍 服务器地址: http://localhost:${PORT}`);
      console.info(`🌍 CORS允许的来源: ${CORS_ORIGIN}`);
      console.info(`🌱 环境: ${process.env.NODE_ENV || 'development'}`);
      console.info('📚 API端点:');
      console.info('   - GET  /api/health - 健康检查');
      console.info('   - POST /api/auth/register - 用户注册');
      console.info('   - POST /api/auth/login - 用户登录');
      console.info('   - GET  /api/courses - 获取课程列表');
      console.info('   - POST /api/courses - 创建课程');
      console.info('   - GET  /api/cards - 获取知识点卡片');
      console.info('   - POST /api/ai/generate-concepts - 生成知识点');
      console.info('✨ 服务已准备就绪，可以开始使用！');
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();