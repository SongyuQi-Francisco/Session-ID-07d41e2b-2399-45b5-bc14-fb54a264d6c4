'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { KnowledgeCard as KnowledgeCardType } from '@/types';

interface KnowledgeCardProps {
  card: KnowledgeCardType;
  index: number;
}

export default function KnowledgeCard({ card, index }: KnowledgeCardProps) {
  const { toggleCardStatus } = useAppStore();
  const isMastered = card.status === 'mastered';

  return (
    <motion.div
      initial={{ x: 100, opacity: 0, rotateY: -10 }}
      animate={{ x: 0, opacity: 1, rotateY: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2 },
      }}
      className={`
        relative w-80 h-64 bg-zinc-900/50 backdrop-blur-sm
        border rounded-xl p-6 cursor-pointer transition-all
        ${isMastered ? 'opacity-50 border-emerald-500/30' : 'border-zinc-800 hover:border-emerald-500/50'}
        ${isMastered ? 'bg-emerald-500/5' : 'hover:shadow-glow'}
      `}
      onClick={() => toggleCardStatus(card.id)}
    >
      {/* 装饰性边框 */}
      <div className="absolute inset-0 rounded-xl pointer-events-none">
        <div className="absolute inset-0 rounded-xl border border-zinc-700/50" />
        {!isMastered && (
          <motion.div
            className="absolute inset-0 rounded-xl border border-emerald-500/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            }}
          />
        )}
      </div>

      {/* 卡片内容 */}
      <div className="relative h-full flex flex-col justify-between">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold font-mono mb-2 leading-tight line-clamp-2">
              {card.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-zinc-500">
              {isMastered ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">已掌握</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>待学习</span>
                </>
              )}
            </div>
          </div>
          <motion.div
            animate={isMastered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            className={`
              p-2 rounded-lg
              ${isMastered ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800/50 text-zinc-400'}
            `}
          >
            {isMastered ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </motion.div>
        </div>

        {/* 摘要 */}
        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4 flex-1">
          {card.summary}
        </p>

        {/* 底部 */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 font-mono">
            {new Date(card.createdAt).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>

      {/* 掌握状态指示器 */}
      {isMastered && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-glow"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}