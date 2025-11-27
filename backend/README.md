# NeuralPrep Backend

NeuralPrep 智能备考助手后端服务，提供用户认证、数据持久化、AI集成等核心功能。

## 🚀 技术栈

- **框架**: Node.js + Express.js
- **类型安全**: TypeScript
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcryptjs
- **开发工具**: ESLint + Prettier + Jest
- **AI集成**: 豆包AI API

## 📋 功能特性

### 用户管理
- 用户注册和登录
- JWT Token认证
- 用户信息管理
- 学习风格设置

### 课程管理
- 课程创建和编辑
- 课程分类和颜色管理
- 课程激活状态控制
- 用户课程隔离

### 知识点管理
- 知识点卡片创建
- 学习状态跟踪
- 难度级别管理
- 相关知识点关联

### AI 功能
- 智能知识点生成
- 学习进度分析
- 复习内容推荐
- 优雅降级机制

### 学习进度
- 掌握程度跟踪
- 学习历史记录
- 复习时间规划
- 统计分析报告

## 🏗️ 项目结构

```
backend/
├─ src/
│  ├─ config/               # 配置文件
│  │  └─ database.ts        # 数据库配置
│  ├─ models/               # 数据模型
│  │  ├─ User.ts            # 用户模型
│  │  ├─ Course.ts          # 课程模型
│  │  ├─ KnowledgeCard.ts   # 知识点卡片模型
│  │  └─ LearningProgress.ts # 学习进度模型
│  ├─ routes/               # API路由
│  │  ├─ auth.ts            # 认证路由
│  │  ├─ courses.ts         # 课程路由
│  │  ├─ cards.ts           # 卡片路由
│  │  └─ ai.ts              # AI路由
│  ├─ controllers/          # 控制器
│  │  ├─ authController.ts  # 认证控制器
│  │  ├─ courseController.ts # 课程控制器
│  │  └─ cardController.ts  # 卡片控制器
│  ├─ middleware/           # 中间件
│  │  ├─ auth.ts            # 认证中间件
│  │  ├─ validate.ts        # 验证中间件
│  │  └─ rateLimit.ts       # 限流中间件
│  ├─ services/             # 服务层
│  │  ├─ authService.ts     # 认证服务
│  │  ├─ courseService.ts   # 课程服务
│  │  └─ doubaoService.ts   # 豆包AI服务
│  ├─ types/                # TypeScript类型定义
│  │  ├─ express.d.ts       # Express扩展类型
│  │  └─ index.ts           # 通用类型
│  └─ server.ts             # 服务器入口文件
├─ tests/                   # 测试文件
├─ .env.example             # 环境变量示例
├─ .env                     # 环境变量
├─ tsconfig.json            # TypeScript配置
├─ package.json             # 项目配置
└─ README.md                # 项目文档
```

## 🛠️ 安装和运行

### 环境要求
- Node.js 18+
- MongoDB 4.4+

### 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和API密钥
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
npm run start
```

5. 运行测试：
```bash
npm test
```

## 🔧 配置说明

### 数据库配置
```env
MONGODB_URI=mongodb://localhost:27017/neuralprep
MONGODB_URI_TEST=mongodb://localhost:27017/neuralprep_test
```

### JWT 配置
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 豆包 AI 配置
```env
DOUBAO_API_KEY=your-doubao-api-key
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/compatible
DOUBAO_MODEL=doubao-seed-1-6-thinking-code-preview
```

## 📡 API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### 获取当前用户
```
GET /api/auth/me
Authorization: Bearer <token>
```

### 课程管理

#### 获取课程列表
```
GET /api/courses
Authorization: Bearer <token>
```

#### 创建课程
```
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string (optional)",
  "color": "string (hex)"
}
```

#### 更新课程
```
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string (optional)",
  "color": "string (hex)",
  "isActive": "boolean"
}
```

#### 删除课程
```
DELETE /api/courses/:id
Authorization: Bearer <token>
```

### 知识点卡片

#### 获取卡片列表
```
GET /api/cards
Authorization: Bearer <token>
Query Parameters:
- courseId: string (optional)
- status: pending | mastered | learning (optional)
- difficulty: easy | medium | hard (optional)
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
```

#### 创建卡片
```
POST /api/cards
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "summary": "string",
  "courseId": "string (optional)",
  "difficulty": "easy | medium | hard (default: medium)",
  "tags": "string[] (optional)"
}
```

#### 更新卡片状态
```
PUT /api/cards/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "pending | mastered | learning",
  "masteryLevel": "number (0-100)"
}
```

### AI 功能

#### 生成相关知识点
```
POST /api/ai/generate-concepts
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "string",
  "courseId": "string (optional)",
  "count": "number (default: 3)"
}
```

#### 分析学习进度
```
GET /api/ai/analyze-progress
Authorization: Bearer <token>
Query Parameters:
- courseId: string (optional)
```

## 🔒 安全特性

- **JWT认证**: 安全的用户认证机制
- **密码加密**: bcryptjs加密存储
- **CORS配置**: 跨域资源共享控制
- **请求限流**: 防止API滥用
- **输入验证**: 防止恶意输入
- **错误处理**: 统一的错误处理机制

## 🧪 测试

### 单元测试
```bash
npm test
```

### 测试覆盖率
```bash
npm test -- --coverage
```

## 🚀 部署

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY .env ./
EXPOSE 3001
CMD ["npm", "start"]
```

### 环境变量
确保在生产环境中设置正确的环境变量，特别是：
- JWT_SECRET: 使用随机生成的安全密钥
- MONGODB_URI: 生产环境数据库连接
- NODE_ENV: production

## 📈 监控和日志

### 日志级别
```env
LOG_LEVEL=info # error, warn, info, debug
```

### 监控建议
- 使用PM2进行进程管理
- 集成Prometheus和Grafana进行监控
- 使用ELK Stack进行日志分析

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请创建 Issue 或联系开发团队。

---

*NeuralPrep Backend - 构建智能学习的坚实基础* 🧠✨