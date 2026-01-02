export interface WrongQuestion {
  id: string;
  content: string;
  imageUrl?: string;
  subject: string;
  createdAt: Date;
  analysis?: QuestionAnalysis;
}

export interface QuestionAnalysis {
  cause: string;
  correctAnswer: string;
  knowledgePoints: KnowledgePoint[];
  similarQuestions: SimilarQuestion[];
}

export interface KnowledgePoint {
  title: string;
  explanation: string;
  examples?: string[];
}

export interface SimilarQuestion {
  id: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface FlashCard {
  id: string;
  questionId: string;
  front: string;
  back: string;
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty: number;
}

export type Subject = 
  | '数学' 
  | '语文' 
  | '英语' 
  | '物理' 
  | '化学' 
  | '生物' 
  | '历史' 
  | '地理' 
  | '政治';

export const SUBJECTS: Subject[] = [
  '数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'
];
