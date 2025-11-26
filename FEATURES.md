# NeuralPrep 功能详解

## 🎨 UI 设计特色

### 赛博朋克视觉元素

#### 色彩系统
- **背景**: 纯黑 (`#09090B`) - 营造深邃科技感
- **主色调**: 霓虹绿 (`#10B981`) - 代表智能与生机
- **辅助色**: 赛博紫 (`#8B5CF6`) - 增加神秘感
- **边框**: 极细边框配合微弱发光效果

#### 字体系统
- **标题**: JetBrains Mono (等宽字体) - 体现代码感和科技感
- **正文**: Noto Sans SC (无衬线字体) - 保证中文可读性
- **终端**: 等宽字体 - 模拟命令行体验

#### 动画效果
- **卡片入场**: 滑入 + 淡入 + 轻微旋转
- **光标闪烁**: 经典终端风格动画
- **悬浮效果**: 卡片悬浮 + 发光边框
- **状态切换**: 弹簧动画 + 缩放效果

## 🔧 技术实现细节

### 状态管理 (Zustand)

```typescript
// 核心状态结构
interface AppState {
  cards: KnowledgeCard[];      // 知识卡片列表
  courses: Course[];          // 课程列表
  currentCourse: Course | null; // 当前选中课程
  isLoading: boolean;         // 加载状态
  // ... 其他状态
}

// 核心操作
const useAppStore = create<AppState>((set, get) => ({
  addCards: (cards) => set((state) => ({ cards: [...state.cards, ...cards] })),
  toggleCardStatus: (cardId) => set((state) => ({
    cards: state.cards.map(card =>
      card.id === cardId
        ? { ...card, status: card.status === 'pending' ? 'mastered' : 'pending' }
        : card
    ),
  })),
  submitTopic: async (topic) => {
    // AI 调用逻辑
  },
}));
```

### AI 模拟服务

```typescript
// 核心 AI 函数
export async function generateRelatedConcepts(topic: string): Promise<KnowledgeCard[]> {
  // 模拟 AI 思考延迟 (1.5秒)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 基于输入主题匹配相关概念
  const relatedConcepts = findRelatedConcepts(topic);

  // 返回格式化的知识卡片
  return relatedConcepts.map(concept => ({
    id: generateUniqueId(),
    title: concept.title,
    summary: concept.summary,
    status: 'pending',
    createdAt: new Date()
  }));
}
```

### 组件架构

#### 知识卡片组件 (KnowledgeCard)
- 磨砂玻璃背景效果 (`backdrop-blur-sm`)
- 双层边框设计 (外层装饰性发光边框)
- 状态动画切换 (待学习 ↔ 已掌握)
- 悬浮交互效果

#### 终端输入组件 (TerminalInput)
- 命令行风格设计
- 实时输入反馈
- 加载状态指示器
- 成功提示动画

## 📊 数据结构

### 知识卡片 (KnowledgeCard)
```typescript
interface KnowledgeCard {
  id: string;                    // 唯一标识符
  title: string;                 // 知识点标题
  summary: string;              // 中文摘要
  status: 'pending' | 'mastered'; // 学习状态
  course?: string;              // 所属课程 (可选)
  createdAt: Date;              // 创建时间
}
```

### 课程 (Course)
```typescript
interface Course {
  id: string;                  // 课程ID
  name: string;               // 课程名称
  color: string;              // 课程主题色
}
```

## 🎯 用户体验设计

### 核心交互流程

```
选择课程 → 输入知识点 → AI 生成相关概念 → 学习卡片 → 标记掌握
     ↑                                  ↓
   课程管理                            知识巩固
```

### 微交互设计

#### 1. 卡片悬停
- 轻微上浮效果 (`y: -8`)
- 发光边框激活
- 缩放动画 (`scale: 1.02`)

#### 2. 状态切换
- 已掌握: 绿色边框 + 勾选标记 + 透明度降低
- 待学习: 默认状态 + 脉冲动画

#### 3. 终端交互
- 聚焦时: 绿色发光边框 + 光标动画
- 输入时: 打字机效果
- 提交时: 加载指示器 + 成功提示

## 🎨 样式系统

### Tailwind 配置扩展

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      zinc: {
        950: '#09090B',
        900: '#18181B',
        800: '#27272A',
      },
    },
    boxShadow: {
      glow: '0 0 15px rgba(16, 185, 129, 0.3)',
      'glow-violet': '0 0 15px rgba(139, 92, 246, 0.3)',
    },
    animation: {
      'typing': 'typing 1.5s steps(20, end)',
      'glitch': 'glitch 1s linear infinite',
    },
  },
}
```

### 自定义工具类

```css
/* globals.css */
.glow-border {
  border: 1px solid transparent;
  background: linear-gradient(#09090B, #09090B) padding-box,
              linear-gradient(135deg, #10B981, #8B5CF6) border-box;
}

.glow-border-active {
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}
```

## 🚀 性能优化

### 1. 动画性能
- 使用 Framer Motion 的硬件加速动画
- 限制动画复杂度避免性能瓶颈
- 合理使用 `will-change` 优化

### 2. 内存管理
- 卡片虚拟滚动 (大量卡片时)
- 合理的状态清理机制
- 避免内存泄漏

### 3. 代码分割
- Next.js 自动代码分割
- 组件懒加载
- 按需加载资源

## 📱 响应式设计

### 断点设计
- **移动端**: < 640px
- **平板**: 640px - 1024px
- **桌面**: > 1024px

### 适配策略
- 侧边栏自动隐藏/展开
- 知识流布局调整
- 终端输入框自适应

## 🔮 未来功能扩展

### 智能学习系统
- 遗忘曲线算法
- 个性化推荐
- 学习进度预测

### 协作功能
- 学习小组
- 知识点分享
- 多人学习模式

### 多媒体支持
- 图片/视频嵌入
- 语音讲解
- 交互式练习

---

*NeuralPrep - 重新定义学习体验* 🧠✨