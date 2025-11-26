'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function TerminalInput() {
  const { submitTopic, isLoading, isTerminalFocused, setTerminalFocus } = useAppStore();
  const [input, setInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await submitTopic(input.trim());
      setInput('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    // 自动聚焦输入框
    if (isTerminalFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalFocused]);

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-6">
        {/* 终端头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center space-x-3 mb-4"
        >
          <Terminal className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
            知识输入终端
          </h3>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </motion.div>

        {/* 输入框容器 */}
        <form onSubmit={handleSubmit}>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className={`
              relative flex items-center space-x-3 px-5 py-4
              bg-zinc-950 border rounded-xl
              ${isTerminalFocused ? 'border-emerald-500 shadow-glow' : 'border-zinc-800'}
              transition-all duration-200
            `}
            onClick={() => setTerminalFocus(true)}
          >
            {/* 提示符 */}
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 font-mono">▶</span>
              <span className="text-zinc-500 text-sm">neuralprep</span>
              <span className="text-zinc-600">▶</span>
            </div>

            {/* 输入框 */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setTerminalFocus(true)}
              onBlur={() => setTerminalFocus(false)}
              placeholder="输入你未掌握的知识点..."
              disabled={isLoading}
              className={`
                flex-1 bg-transparent border-none outline-none text-white
                placeholder-zinc-600 font-mono text-sm
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${input && !isLoading ? 'animate-typing' : ''}
              `}
            />

            {/* 光标动画 */}
            {isTerminalFocused && !isLoading && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="w-2 h-4 bg-emerald-500"
              />
            )}

            {/* 提交按钮 */}
            <AnimatePresence mode="wait">
              {input.trim() && !isLoading ? (
                <motion.button
                  type="submit"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              ) : isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-zinc-500 font-mono">处理中</span>
                </motion.div>
              ) : (
                <div className="w-8" />
              )}
            </AnimatePresence>
          </motion.div>
        </form>

        {/* 状态提示 */}
        <AnimatePresence mode="wait">
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: '50%' }}
              animate={{ opacity: 1, y: 0, x: '50%' }}
              exit={{ opacity: 0, y: 10, x: '50%' }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-mono">知识图谱已更新</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 使用提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center justify-between text-xs text-zinc-500"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded text-xs">Enter</kbd>
              <span>提交</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-0.5 bg-zinc-800 rounded text-xs">Tab</kbd>
              <span>自动补全</span>
            </div>
          </div>
          <div className="font-mono">Terminal v1.0.0</div>
        </motion.div>
      </div>

      {/* 装饰性扫描线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-50" />
    </div>
  );
}