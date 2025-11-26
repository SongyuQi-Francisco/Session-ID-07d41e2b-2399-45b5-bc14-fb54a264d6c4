'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Code } from 'lucide-react';
import KnowledgeCard from './KnowledgeCard';
import { useAppStore } from '@/store/useAppStore';

export default function KnowledgeStream() {
  const { cards, isLoading, currentCourse } = useAppStore();

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* 头部信息 */}
      <div className="p-6 border-b border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold font-mono mb-2">
              知识<span className="text-emerald-500">流</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              {currentCourse ? (
                <span className="flex items-center">
                  <Code className="w-4 h-4 mr-1 text-emerald-500" />
                  当前课程: <span className="text-emerald-500 ml-1">{currentCourse.name}</span>
                </span>
              ) : (
                '选择课程开始学习之旅'
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-mono">{cards.length} 个知识点</span>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-glow animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* 知识卡片流 */}
      <div className="flex-1 overflow-x-auto p-6">
        {cards.length === 0 ? (
          // 空状态
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-6">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-20 h-20 mx-auto mb-4 text-emerald-500/30"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold font-mono mb-2">
              暂无<span className="text-emerald-500">知识点</span>
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md">
              在下方终端输入框中输入你未掌握的知识点，AI将为你生成相关的学习卡片。
            </p>
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 font-mono text-sm">
              <div className="text-emerald-500 mb-1">示例输入：</div>
              <div className="text-zinc-300">→ 特征值与特征向量</div>
              <div className="text-zinc-300">→ 光合作用</div>
              <div className="text-zinc-300">→ 数据结构</div>
            </div>
          </motion.div>
        ) : (
          // 卡片流
          <div className="flex space-x-6 pb-6">
            {cards.map((card, index) => (
              <KnowledgeCard key={card.id} card={card} index={index} />
            ))}

            {/* 加载指示器 */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 h-64 bg-zinc-900/30 backdrop-blur-sm border border-dashed border-zinc-700 rounded-xl flex items-center justify-center"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-zinc-400 text-sm font-mono">
                    正在解析知识图谱...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 滚动提示 */}
      {cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 text-zinc-500/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}