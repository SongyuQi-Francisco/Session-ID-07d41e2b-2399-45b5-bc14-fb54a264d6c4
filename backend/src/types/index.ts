export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  avatar?: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
}

export interface Course {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCreateInput {
  name: string;
  description?: string;
  color?: string;
}

export interface CourseUpdateInput {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface KnowledgeCard {
  _id: string;
  userId: string;
  courseId?: string;
  title: string;
  summary: string;
  content?: string;
  status: 'pending' | 'mastered' | 'learning';
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  relatedCards?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeCardCreateInput {
  title: string;
  summary: string;
  courseId?: string;
  content?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  relatedCards?: string[];
}

export interface KnowledgeCardUpdateInput {
  title?: string;
  summary?: string;
  content?: string;
  status?: 'pending' | 'mastered' | 'learning';
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  relatedCards?: string[];
}

export interface LearningProgress {
  _id: string;
  userId: string;
  cardId: string;
  courseId?: string;
  masteryLevel: number;
  lastReviewed: Date;
  reviewCount: number;
  nextReviewDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningProgressUpdateInput {
  masteryLevel?: number;
  notes?: string;
  reviewCount?: number;
  nextReviewDate?: Date;
}

export interface InputHistory {
  _id: string;
  userId: string;
  courseId?: string;
  topic: string;
  response?: any;
  createdAt: Date;
}

export interface InputHistoryCreateInput {
  topic: string;
  courseId?: string;
  response?: any;
}

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface GenerateConceptsRequest {
  topic: string;
  courseId?: string;
  count?: number;
}

export interface AIConcept {
  title: string;
  summary: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LearningAnalysis {
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  pendingCards: number;
  masteryRate: number;
  averageMasteryLevel: number;
  studyStreak: number;
  recentActivity: Array<{
    date: Date;
    cardsReviewed: number;
    masteryGained: number;
  }>;
}

export interface Recommendation {
  recommendedCards: string[];
  focusAreas: string[];
  studyTips: string[];
  suggestedCourses: string[];
}