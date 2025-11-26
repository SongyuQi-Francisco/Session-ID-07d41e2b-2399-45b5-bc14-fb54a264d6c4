'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Plus, Trash2, Brain } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Sidebar() {
  const { courses, currentCourse, isSidebarCollapsed, toggleSidebar, setCurrentCourse, clearCards } = useAppStore();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{
        x: isSidebarCollapsed ? -100 : 0,
        opacity: isSidebarCollapsed ? 0 : 1,
        width: isSidebarCollapsed ? 0 : 280,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-zinc-900/80 backdrop-blur-sm border-r border-zinc-800 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Brain className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold font-mono tracking-wider">
              NEURAL<span className="text-emerald-500">PREP</span>
            </h1>
          </motion.div>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-zinc-400 font-mono"
        >
          神经备考助手
        </motion.p>
      </div>

      {/* 课程列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xs font-mono uppercase text-zinc-500 mb-3 tracking-wider">
            我的课程
          </h2>

          <div className="space-y-2">
            {courses.map((course, index) => (
              <motion.button
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentCourse(course)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                  currentCourse?.id === course.id
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-glow'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span className="text-left flex-1 font-medium">{course.name}</span>
                {currentCourse?.id === course.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* 添加课程按钮 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-dashed border-zinc-700 mt-3 hover:border-zinc-600 transition-colors"
          >
            <Plus className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">添加课程</span>
          </motion.button>
        </div>

        {/* 统计信息 */}
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <h3 className="text-xs font-mono uppercase text-zinc-500 mb-2 tracking-wider">
              学习统计
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">总知识点</span>
                <span className="font-mono">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">已掌握</span>
                <span className="font-mono text-emerald-500">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">掌握率</span>
                <span className="font-mono">0%</span>
              </div>
            </div>
          </div>

          {/* 清空所有卡片按钮 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={clearCards}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">清空知识点</span>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 font-mono">
          <div className="mb-1">⚡ NeuralPrep v1.0.0</div>
          <div>💻 Cyberpunk Edition</div>
        </div>
      </div>
    </motion.aside>
  );
}