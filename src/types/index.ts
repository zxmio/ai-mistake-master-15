export interface WrongQuestion {
  id: string;
  content: string;
  imageUrl?: string;
  subject: Subject;
  createdAt: Date;
  analysis?: QuestionAnalysis;
}

export interface QuestionAnalysis {
  cause: string;
  correctAnswer: string;
  knowledgePoints: KnowledgePoint[];
  similarQuestions: SimilarQuestion[];
  knowledgeCardUrl?: string;
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

// Match database enum
export type Subject = 
  | 'math' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'chinese' 
  | 'english' 
  | 'history' 
  | 'geography' 
  | 'politics';

export const SUBJECTS: { value: Subject; label: string }[] = [
  { value: 'math', label: '数学' },
  { value: 'chinese', label: '语文' },
  { value: 'english', label: '英语' },
  { value: 'physics', label: '物理' },
  { value: 'chemistry', label: '化学' },
  { value: 'biology', label: '生物' },
  { value: 'history', label: '历史' },
  { value: 'geography', label: '地理' },
  { value: 'politics', label: '政治' },
];

export const getSubjectLabel = (value: Subject): string => {
  const subject = SUBJECTS.find(s => s.value === value);
  return subject?.label || value;
};
