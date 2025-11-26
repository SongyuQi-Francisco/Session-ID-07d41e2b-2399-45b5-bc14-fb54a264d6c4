# NeuralPrep - 神经备考助手

## 🚀 项目简介

NeuralPrep 是一款基于 Next.js 14+ 构建的智能期末备考助手，采用赛博朋克(Cyberpunk)风格设计，为用户提供高效、有趣的学习体验。

## ✨ 核心功能

- 📚 **课程管理**: 多课程分类管理
- 🧠 **AI知识生成**: 输入知识点，AI自动生成相关概念卡片
- 🔄 **知识流**: 横向无限滚动的卡片流展示
- 🎯 **掌握状态**: 标记知识点掌握状态
- 💾 **本地存储**: 自动保存学习进度
- 🎨 **赛博朋克UI**: 未来科技感的视觉设计

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图标**: Lucide React
- **字体**: Noto Sans SC + JetBrains Mono

## 🎨 设计特色

### 视觉风格
- **赛博朋克/黑客美学**
- **深色模式**: 纯黑背景 (`zinc-950`)
- **强调色**: 霓虹绿 (`emerald-500`) + 赛博紫 (`violet-500`)
- **发光效果**: 激活状态光晕 (`shadow-[0_0_15px_rgba(16,185,129,0.3)]`)

### 交互体验
- **丝滑动画**: 卡片滑入+淡入效果
- **打字机效果**: 文字渲染动画
- **故障艺术**: 交互时轻微 glitch 效果
- **响应式设计**: 适配各种屏幕尺寸

## 📖 使用说明

### 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
npm run start
```

### 操作指南

1. **选择课程**: 从左侧侧边栏选择学习课程
2. **输入知识点**: 在底部终端输入框中输入你未掌握的知识点
3. **学习卡片**: AI 将生成相关概念卡片，横向滚动查看
4. **标记掌握**: 点击卡片标记为已掌握

## 📁 项目结构

```
neuralprep/
├─ src/
│  ├─ app/                  # Next.js App Router
│  │  ├─ layout.tsx        # 根布局
│  │  └─ page.tsx          # 主页面
│  ├─ components/           # React 组件
│  │  ├─ Sidebar.tsx       # 侧边栏组件
│  │  ├─ KnowledgeStream.tsx # 知识流组件
│  │  ├─ KnowledgeCard.tsx   # 知识卡片组件
│  │  └─ TerminalInput.tsx   # 终端输入组件
│  ├─ store/               # 状态管理
│  │  └─ useAppStore.ts    # Zustand Store
│  ├─ services/            # 服务层
│  │  └─ ai.ts            # AI 模拟服务
│  ├─ types/               # TypeScript 类型定义
│  │  └─ index.ts         # 类型声明
│  └─ lib/                 # 工具函数
├─ tailwind.config.ts      # Tailwind 配置
├─ tsconfig.json          # TypeScript 配置
└─ package.json           # 项目配置
```

## 🧠 AI 模拟系统

在 MVP 阶段，AI 服务通过模拟实现，包含以下学科知识库：

- 📐 数学 (线性代数、微积分)
- 💻 计算机科学 (数据结构、算法、数据库)
- 🧬 生物学 (光合作用、细胞呼吸)
- ⚛️ 物理学 (牛顿运动定律)
- 🎨 人文社科 (西方艺术史、心理学)

## 🎯 核心特性详解

### 1. 知识卡片
- 磨砂玻璃效果背景
- 悬停发光动画
- 掌握状态视觉反馈
- 打字机渲染效果

### 2. 终端输入
- 命令行风格设计
- 绿色光标动画
- 实时状态提示
- 键盘快捷键支持 (Enter 提交)

### 3. 知识流
- 横向无限滚动
- 卡片递进式动画
- 动态加载指示器
- 空状态引导

## 🚧 未来规划

- [ ] 真实 AI 集成 (OpenAI API)
- [ ] 多语言支持
- [ ] 学习进度分析
- [ ] 知识点搜索功能
- [ ] 导出学习笔记
- [ ] 移动端适配优化

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**NeuralPrep - 让学习变得更智能、更有趣** 🚀