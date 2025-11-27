# NeuralPrep Backend API 文档

## 📋 概述

NeuralPrep后端API提供完整的智能学习管理功能，包括用户认证、课程管理、知识点卡片管理和AI集成等。

## 🔧 基础信息

### 服务器信息
- **基础URL**: `http://localhost:3001/api`
- **开发环境**: `http://localhost:3001/api`
- **内容类型**: `application/json`
- **认证方式**: JWT Token

### 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🔐 认证 API

### 用户注册

**Endpoint**: `POST /auth/register`

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "avatar": "string (可选)",
  "learningStyle": "visual|auditory|reading|kinesthetic (可选)"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "learningStyle": "reading",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 用户登录

**Endpoint**: `POST /auth/login`

**请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "learningStyle": "reading",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 获取当前用户

**Endpoint**: `GET /auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "learningStyle": "reading",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 更新用户信息

**Endpoint**: `PUT /auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "username": "string (可选)",
  "email": "string (可选)",
  "avatar": "string (可选)",
  "learningStyle": "visual|auditory|reading|kinesthetic (可选)"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "new_username",
    "email": "new_email@example.com",
    "avatar": "new_avatar_url",
    "learningStyle": "visual",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "用户信息更新成功"
}
```

### 停用用户

**Endpoint**: `DELETE /auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "isActive": false
  },
  "message": "用户已停用"
}
```

## 📚 课程管理 API

### 获取课程列表

**Endpoint**: `GET /courses`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `sort`: 排序字段 (默认: `-createdAt`)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "线性代数",
      "description": "大学数学线性代数课程",
      "color": "#10B981",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "cardCount": 15
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### 获取课程统计

**Endpoint**: `GET /courses/stats`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "线性代数",
      "color": "#10B981",
      "totalCards": 15,
      "masteredCards": 8,
      "learningCards": 4,
      "pendingCards": 3
    }
  ]
}
```

### 创建课程

**Endpoint**: `POST /courses`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "name": "string",
  "description": "string (可选)",
  "color": "string (hex, 可选，默认: #10B981)"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "新课程",
    "description": "课程描述",
    "color": "#10B981",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "cardCount": 0
  },
  "message": "课程创建成功"
}
```

### 获取单个课程

**Endpoint**: `GET /courses/:courseId`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "线性代数",
    "description": "大学数学线性代数课程",
    "color": "#10B981",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "cardCount": 15
  }
}
```

### 更新课程

**Endpoint**: `PUT /courses/:courseId`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "name": "string (可选)",
  "description": "string (可选)",
  "color": "string (hex, 可选)",
  "isActive": "boolean (可选)"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "更新后的课程名",
    "description": "更新后的描述",
    "color": "#8B5CF6",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "cardCount": 15
  },
  "message": "课程更新成功"
}
```

### 删除课程

**Endpoint**: `DELETE /courses/:courseId`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "message": "课程已删除",
    "courseId": "string"
  },
  "message": "课程删除成功"
}
```

## 🧠 知识点卡片 API

### 获取卡片列表

**Endpoint**: `GET /cards`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `sort`: 排序字段 (默认: `-createdAt`)
- `courseId`: 课程ID (可选)
- `status`: 状态 (pending|mastered|learning, 可选)
- `difficulty`: 难度 (easy|medium|hard, 可选)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "特征值与特征向量",
      "summary": "特征值是线性变换中只被标量缩放而不改变方向的向量...",
      "status": "pending",
      "difficulty": "medium",
      "tags": ["线性代数", "矩阵"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "course": {
        "name": "线性代数",
        "color": "#10B981"
      },
      "progress": {
        "masteryLevel": 0,
        "lastReviewed": "2024-01-01T00:00:00.000Z",
        "reviewCount": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 获取卡片统计

**Endpoint**: `GET /cards/stats`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `courseId`: 课程ID (可选)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "mastered": 8,
    "learning": 10,
    "pending": 7,
    "easy": 5,
    "medium": 15,
    "hard": 5,
    "masteryRate": 32
  }
}
```

### 获取推荐复习卡片

**Endpoint**: `GET /cards/review`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `limit`: 数量 (默认: 10)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "特征值与特征向量",
      "summary": "特征值是线性变换中只被标量缩放而不改变方向的向量...",
      "status": "learning",
      "difficulty": "medium",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "course": {
        "name": "线性代数",
        "color": "#10B981"
      },
      "progress": {
        "masteryLevel": 65,
        "lastReviewed": "2024-01-01T00:00:00.000Z",
        "reviewCount": 2,
        "nextReviewDate": "2024-01-05T00:00:00.000Z"
      }
    }
  ],
  "message": "获取到5张推荐复习卡片"
}
```

### 创建卡片

**Endpoint**: `POST /cards`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "title": "string",
  "summary": "string",
  "courseId": "string (可选)",
  "content": "string (可选)",
  "difficulty": "easy|medium|hard (可选, 默认: medium)",
  "tags": ["string"] (可选),
  "relatedCards": ["string"] (可选)
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "新知识点",
    "summary": "知识点摘要",
    "status": "pending",
    "difficulty": "medium",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "progress": {
      "masteryLevel": 0,
      "lastReviewed": "2024-01-01T00:00:00.000Z",
      "reviewCount": 0
    }
  },
  "message": "知识点卡片创建成功"
}
```

### 获取单个卡片

**Endpoint**: `GET /cards/:cardId`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "特征值与特征向量",
    "summary": "特征值是线性变换中只被标量缩放而不改变方向的向量...",
    "content": "详细内容...",
    "status": "pending",
    "difficulty": "medium",
    "tags": ["线性代数", "矩阵"],
    "relatedCards": [
      {
        "id": "string",
        "title": "矩阵乘法",
        "summary": "矩阵乘法是线性代数中的核心运算...",
        "status": "mastered",
        "difficulty": "easy"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "course": {
      "name": "线性代数",
      "color": "#10B981"
    },
    "progress": {
      "masteryLevel": 0,
      "lastReviewed": "2024-01-01T00:00:00.000Z",
      "reviewCount": 0,
      "notes": "学习笔记..."
    }
  }
}
```

### 更新卡片

**Endpoint**: `PUT /cards/:cardId`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "title": "string (可选)",
  "summary": "string (可选)",
  "content": "string (可选)",
  "status": "pending|mastered|learning (可选)",
  "difficulty": "easy|medium|hard (可选)",
  "tags": ["string"] (可选),
  "relatedCards": ["string"] (可选)
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "更新后的知识点",
    "summary": "更新后的摘要",
    "status": "learning",
    "difficulty": "hard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "知识点卡片更新成功"
}
```

### 更新卡片状态

**Endpoint**: `PUT /cards/:cardId/status`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "status": "pending|mastered|learning (可选)",
  "masteryLevel": 0-100 (可选),
  "notes": "string (可选)"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "string",
      "title": "特征值与特征向量",
      "status": "mastered",
      "difficulty": "medium"
    },
    "progress": {
      "masteryLevel": 90,
      "lastReviewed": "2024-01-02T00:00:00.000Z",
      "reviewCount": 3,
      "nextReviewDate": "2024-01-15T00:00:00.000Z",
      "notes": "已掌握这个知识点"
    }
  },
  "message": "知识点卡片状态更新成功"
}
```

### 批量更新卡片状态

**Endpoint**: `PUT /cards/batch/update-status`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "cardIds": ["string1", "string2"],
  "status": "pending|mastered|learning"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "updatedCount": 2,
    "matchedCount": 2
  },
  "message": "成功更新2张卡片状态"
}
```

### 删除卡片

**Endpoint**: `DELETE /cards/:cardId`

**Headers**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "message": "知识点卡片已删除",
    "cardId": "string"
  },
  "message": "知识点卡片删除成功"
}
```

## 🤖 AI 功能 API

### 生成相关知识点

**Endpoint**: `POST /ai/generate-concepts`

**Headers**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "topic": "string",
  "courseId": "string (可选)",
  "count": 3 (可选, 1-10)
}
```

**查询参数**:
- `save`: 是否保存到数据库 (true/false, 可选, 默认: false)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "concepts": [
      {
        "title": "光反应",
        "summary": "光反应发生在叶绿体类囊体膜上，将光能转化为化学能...",
        "difficulty": "medium"
      },
      {
        "title": "卡尔文循环",
        "summary": "卡尔文循环发生在叶绿体基质中，利用光反应产生的ATP和NADPH...",
        "difficulty": "hard"
      },
      {
        "title": "叶绿体结构",
        "summary": "叶绿体是进行光合作用的细胞器，由外膜、内膜、类囊体和基质组成...",
        "difficulty": "easy"
      }
    ],
    "savedCards": null
  },
  "message": "知识点生成成功"
}
```

### 分析学习进度

**Endpoint**: `GET /ai/analyze-progress`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `courseId`: 课程ID (可选)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalCards": 25,
    "masteredCards": 8,
    "learningCards": 10,
    "pendingCards": 7,
    "masteryRate": 32,
    "averageMasteryLevel": 45,
    "studyStreak": 5,
    "recentActivity": [
      {
        "date": "2024-01-01T00:00:00.000Z",
        "cardsReviewed": 3,
        "masteryGained": 15
      }
    ]
  }
}
```

### 获取复习推荐

**Endpoint**: `GET /ai/recommend-review`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `limit`: 数量 (默认: 10)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "recommendedCards": ["card1", "card2", "card3"],
    "focusAreas": ["线性代数", "高等数学"],
    "studyTips": [
      "建议重点复习特征值相关概念",
      "可以结合练习题加深理解"
    ],
    "suggestedCourses": ["线性代数进阶", "矩阵理论"]
  }
}
```

### 获取输入历史

**Endpoint**: `GET /ai/input-history`

**Headers**:
```
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `courseId`: 课程ID (可选)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "topic": "光合作用",
      "response": {
        "success": true,
        "concepts": [...],
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "course": {
        "name": "生物学",
        "color": "#EC4899"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

## 🔍 健康检查

### 服务状态

**Endpoint**: `GET /health`

**响应示例**:
```json
{
  "success": true,
  "message": "NeuralPrep Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.56,
  "version": "1.0.0"
}
```

## ⚠️ 错误处理

### 常见错误代码

| 状态码 | 错误类型 | 描述 |
|--------|----------|------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 用户未认证或认证失败 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如重复数据） |
| 429 | Too Many Requests | 请求过于频繁 |
| 500 | Internal Server Error | 服务器内部错误 |

### 错误响应示例

```json
{
  "success": false,
  "error": "该邮箱已被注册",
  "data": {
    "email": ["该邮箱已被注册"]
  }
}
```

## 🎯 使用示例

### JavaScript/Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用户登录
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data.data;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return response.data;
};

// 获取课程列表
const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

// 生成知识点
const generateConcepts = async (topic, count = 3) => {
  const response = await api.post('/ai/generate-concepts', {
    topic,
    count
  }, {
    params: { save: true }
  });
  return response.data;
};
```

### cURL

```bash
# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 获取课程列表（需要替换 YOUR_TOKEN）
curl -X GET http://localhost:3001/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"

# 生成知识点
curl -X POST http://localhost:3001/api/ai/generate-concepts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"光合作用","count":3}' \
  --data-urlencode "save=true"
```

## 🚀 部署

### 环境变量

```env
PORT=3001
NODE_ENV=production

MONGODB_URI=mongodb://localhost:27017/neuralprep

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

CORS_ORIGIN=https://yourdomain.com

DOUBAO_API_KEY=your-doubao-api-key
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/compatible
DOUBAO_MODEL=doubao-seed-1-6-thinking-code-preview

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

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

---

*NeuralPrep API Documentation - 智能学习，触手可及* 🧠✨