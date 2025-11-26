import { create } from 'zustand';
import type { KnowledgeCard, Course, UserInput } from '@/types';
import { generateRelatedConcepts } from '@/services/ai';

interface AppState {
  // 数据
  cards: KnowledgeCard[];
  courses: Course[];
  currentCourse: Course | null;
  inputHistory: UserInput[];

  // UI状态
  isSidebarCollapsed: boolean;
  isLoading: boolean;
  isTerminalFocused: boolean;

  // 操作
  addCard: (card: KnowledgeCard) => void;
  addCards: (cards: KnowledgeCard[]) => void;
  toggleCardStatus: (cardId: string) => void;
  addCourse: (course: Course) => void;
  setCurrentCourse: (course: Course | null) => void;
  toggleSidebar: () => void;
  setTerminalFocus: (focused: boolean) => void;
  submitTopic: (topic: string) => Promise<void>;
  clearCards: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始数据
  cards: [],
  courses: [
    { id: 'math', name: '线性代数', color: '#10B981' },
    { id: 'cs', name: '计算机科学', color: '#8B5CF6' },
    { id: 'bio', name: '生物学', color: '#EC4899' },
    { id: 'physics', name: '物理学', color: '#3B82F6' },
  ],
  currentCourse: null,
  inputHistory: [],

  // 初始UI状态
  isSidebarCollapsed: false,
  isLoading: false,
  isTerminalFocused: false,

  // 操作函数
  addCard: (card) => set((state) => ({
    cards: [...state.cards, card],
  })),

  addCards: (cards) => set((state) => ({
    cards: [...state.cards, ...cards],
  })),

  toggleCardStatus: (cardId) => set((state) => ({
    cards: state.cards.map((card) =>
      card.id === cardId
        ? { ...card, status: card.status === 'pending' ? 'mastered' : 'pending' }
        : card
    ),
  })),

  addCourse: (course) => set((state) => ({
    courses: [...state.courses, course],
  })),

  setCurrentCourse: (course) => set(() => ({
    currentCourse: course,
  })),

  toggleSidebar: () => set((state) => ({
    isSidebarCollapsed: !state.isSidebarCollapsed,
  })),

  setTerminalFocus: (focused) => set(() => ({
    isTerminalFocused: focused,
  })),

  submitTopic: async (topic) => {
    if (!topic.trim()) return;

    const state = get();
    set(() => ({ isLoading: true }));

    try {
      // 保存输入历史
      const newInput: UserInput = {
        topic: topic.trim(),
        course: state.currentCourse?.id,
      };

      set((prev) => ({
        inputHistory: [...prev.inputHistory, newInput],
      }));

      // 生成相关概念
      const relatedCards = await generateRelatedConcepts(topic.trim());

      // 添加到卡片列表
      set((prev) => ({
        cards: [...prev.cards, ...relatedCards],
      }));
    } catch (error) {
      console.error('Error generating concepts:', error);
    } finally {
      set(() => ({ isLoading: false }));
    }
  },

  clearCards: () => set(() => ({ cards: [] })),
}));

// 持久化存储（可选）
if (typeof window !== 'undefined') {
  const savedState = localStorage.getItem('neuralprep-state');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      useAppStore.setState({
        cards: parsedState.cards || [],
        courses: parsedState.courses || [],
        currentCourse: parsedState.currentCourse || null,
        inputHistory: parsedState.inputHistory || [],
      });
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }

  // 监听状态变化并保存
  useAppStore.subscribe((state) => {
    localStorage.setItem('neuralprep-state', JSON.stringify({
      cards: state.cards,
      courses: state.courses,
      currentCourse: state.currentCourse,
      inputHistory: state.inputHistory,
    }));
  });
}