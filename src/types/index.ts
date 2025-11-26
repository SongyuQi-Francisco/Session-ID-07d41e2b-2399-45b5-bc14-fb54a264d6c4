export interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  status: 'pending' | 'mastered';
  course?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  color: string;
}

export interface UserInput {
  topic: string;
  course?: string;
}