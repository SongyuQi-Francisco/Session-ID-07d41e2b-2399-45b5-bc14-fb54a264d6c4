# NeuralPrep Backend 快速入门

## 🚀 快速开始

### 1. 环境要求

确保您的系统已安装以下软件：
- **Node.js**: 18.0.0+
- **MongoDB**: 4.4+
- **npm**: 9.0.0+ 或 **yarn**: 1.22.0+

### 2. 安装步骤

#### 2.1 克隆项目
```bash
# 进入项目目录
cd /Users/franciscoqi/Desktop/seed

# 查看项目结构
ls -la
```

#### 2.2 安装依赖
```bash
cd backend
npm install
```

#### 2.3 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件
vim .env
```

**必要配置项**：
```env
# 数据库连接
MONGODB_URI=mongodb://localhost:27017/neuralprep

# JWT 密钥（必须修改）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 豆包 AI 配置（已预配置）
DOUBAO_API_KEY=1e205b09-ca97-4e03-a812-d409f7a21a6d
```

#### 2.4 启动MongoDB
```bash
# 启动 MongoDB 服务
mongod

# 或使用 Docker
docker run -d -p 27017:27017 --name neuralprep-mongo mongo:4.4
```

#### 2.5 启动开发服务器
```bash
# 启动开发服务器（自动重启）
npm run dev

# 或构建并启动生产服务器
npm run build
npm run start
```

#### 2.6 验证服务
```bash
# 检查服务状态
curl http://localhost:3001/api/health
```

**预期响应**：
```json
{
  "success": true,
  "message": "NeuralPrep Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "version": "1.0.0"
}
```

## 🎯 核心功能演示

### 1. 用户注册和登录

#### 1.1 用户注册
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "learningStyle": "visual"
  }'
```

#### 1.2 用户登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**保存返回的 `token`，后续请求需要使用**。

### 2. 课程管理

#### 2.1 创建课程
```bash
curl -X POST http://localhost:3001/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "线性代数",
    "description": "大学数学线性代数课程",
    "color": "#10B981"
  }'
```

#### 2.2 获取课程列表
```bash
curl -X GET http://localhost:3001/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. 知识点管理

#### 3.1 手动创建知识点卡片
```bash
curl -X POST http://localhost:3001/api/cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "特征值与特征向量",
    "summary": "特征值是线性变换中只被标量缩放而不改变方向的向量...",
    "courseId": "YOUR_COURSE_ID",
    "difficulty": "medium",
    "tags": ["线性代数", "矩阵"]
  }'
```

#### 3.2 使用AI生成知识点
```bash
curl -X POST "http://localhost:3001/api/ai/generate-concepts?save=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "光合作用",
    "courseId": "YOUR_COURSE_ID",
    "count": 3
  }'
```

### 4. 学习进度跟踪

#### 4.1 更新知识点掌握状态
```bash
curl -X PUT http://localhost:3001/api/cards/YOUR_CARD_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "mastered",
    "masteryLevel": 90,
    "notes": "已完全掌握这个知识点"
  }'
```

#### 4.2 获取推荐复习卡片
```bash
curl -X GET http://localhost:3001/api/cards/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -G -d "limit=5"
```

## 🧪 开发工具

### 代码质量检查
```bash
# ESLint 检查
npm run lint

# ESLint 检查并自动修复
npm run lint:fix

# Prettier 格式化
npx prettier --write .
```

### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- authService.test.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage
```

### 生产构建
```bash
# 构建 TypeScript 代码
npm run build

# 启动生产服务器
npm run start
```

## 🔍 调试和监控

### 查看日志
```bash
# 开发服务器日志会实时显示在控制台
# 生产环境建议配置日志收集系统（如 ELK Stack）
```

### 数据库管理
```bash
# 使用 MongoDB 客户端连接
mongo http://localhost:27017/neuralprep

# 查看数据库中的用户
db.users.find().pretty()

# 查看数据库中的课程
db.courses.find().pretty()

# 查看数据库中的知识点卡片
db.knowledgecards.find().pretty()
```

### API 测试工具
推荐使用以下工具进行 API 测试：

1. **Postman**: 功能强大的 API 测试工具
2. **Insomnia**: 美观易用的 API 设计工具
3. **curl**: 命令行工具（适合快速测试）

## 🐛 常见问题

### 1. 数据库连接失败
```
❌ Database connection failed: MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**解决方案**：
- 确保 MongoDB 服务正在运行
- 检查 MongoDB 连接地址是否正确
- 检查防火墙设置，确保 27017 端口开放

### 2. JWT 认证失败
```
{"success":false,"error":"无效的认证token"}
```

**解决方案**：
- 确保请求头中包含正确的 `Authorization: Bearer <token>`
- 检查 token 是否过期
- 检查 JWT_SECRET 是否正确配置

### 3. AI 生成失败
```
{"success":false,"error":"AI服务暂时不可用，使用本地知识库"}
```

**解决方案**：
- 检查网络连接
- 确认豆包 AI API 密钥是否有效
- 查看控制台错误日志获取详细信息

### 4. 端口占用
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解决方案**：
- 杀死占用 3001 端口的进程：
  ```bash
  lsof -ti:3001 | xargs kill -9
  ```
- 或修改 `.env` 文件中的 `PORT` 配置

## 🚀 部署建议

### 开发环境
- 使用 `npm run dev` 启动
- 自动热重载
- 详细错误信息

### 测试环境
- 使用 `npm run build && npm run start`
- 独立的测试数据库
- 自动化测试

### 生产环境

#### 1. 环境变量安全
- 使用环境变量管理敏感信息
- 定期更新 JWT_SECRET
- 限制 API 密钥的权限

#### 2. 数据库配置
- 使用 MongoDB Atlas 或自建高可用集群
- 配置数据库备份策略
- 启用数据库访问控制

#### 3. 性能优化
- 使用 Redis 缓存热点数据
- 启用 Gzip 压缩
- 配置 CDN

#### 4. 监控和日志
- 集成 Prometheus + Grafana 监控
- 使用 ELK Stack 收集日志
- 配置告警系统

## 📚 扩展阅读

- [API 文档](./API_DOCUMENTATION.md) - 详细的 API 接口说明
- [后端架构](./BACKEND_ARCHITECTURE.md) - 系统架构设计
- [前端项目](../README.md) - 前端项目说明

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📞 支持

如有问题或建议，请：
1. 查看现有 Issues
2. 创建新的 Issue
3. 联系开发团队

---

*NeuralPrep Backend - 快速入门指南* 🚀✨
