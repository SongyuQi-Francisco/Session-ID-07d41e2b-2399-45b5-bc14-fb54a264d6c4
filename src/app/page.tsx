'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import KnowledgeStream from '@/components/KnowledgeStream';
import TerminalInput from '@/components/TerminalInput';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { isSidebarCollapsed } = useAppStore();

  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* 背景网格效果 */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* 主内容区域 */}
      <div className="relative flex h-screen">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 知识流 */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-72'}`}>
          <KnowledgeStream />

          {/* 终端输入 */}
          <div className="relative">
            {/* 渐变遮罩 */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none" />
            <TerminalInput />
          </div>
        </main>
      </div>

      {/* 装饰性元素 */}
      <motion.div
        className="fixed top-20 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <motion.div
        className="fixed bottom-20 left-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* 顶部信息条 */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ${isSidebarCollapsed ? '' : 'ml-72'}`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-zinc-400 font-mono">SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400">AI:</span>
                <span className="text-emerald-500 font-mono">ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-zinc-500 font-mono">NEURALPREP-MVP-2024</span>
              <div className="h-4 w-px bg-zinc-800" />
              <span className="text-zinc-500">© 2024</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}