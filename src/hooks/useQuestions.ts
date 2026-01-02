import { useState, useCallback } from "react";
import { WrongQuestion, FlashCard, QuestionAnalysis, Subject } from "@/types";

// Mock data for demonstration
const mockAnalysis: QuestionAnalysis = {
  cause: "主要原因是对二次函数顶点坐标公式记忆不牢固，同时在计算过程中符号处理出现错误。你把开口方向与顶点位置的关系理解反了，导致最终答案的正负号判断失误。",
  correctAnswer: `首先，将二次函数 y = 2x² - 4x + 1 化为顶点式：
y = 2(x² - 2x) + 1
y = 2(x² - 2x + 1 - 1) + 1
y = 2(x - 1)² - 2 + 1
y = 2(x - 1)² - 1

所以顶点坐标为 (1, -1)
由于 a = 2 > 0，开口向上，所以顶点为最低点。`,
  knowledgePoints: [
    {
      title: "配方法求顶点",
      explanation: "配方法是求二次函数顶点的核心方法。对于 y = ax² + bx + c，先提取 a，再对括号内的式子配方成完全平方式。配方的关键是'加一半的平方，再减去一半的平方'。",
      examples: [
        "y = x² + 4x + 3 → y = (x + 2)² - 1，顶点(-2, -1)",
        "y = -x² + 6x - 5 → y = -(x - 3)² + 4，顶点(3, 4)"
      ]
    },
    {
      title: "开口方向判断",
      explanation: "二次函数的开口方向由系数 a 决定：a > 0 时开口向上，此时顶点是最低点；a < 0 时开口向下，此时顶点是最高点。想象成一个碗，正着放能装水（a>0），倒着放水流走（a<0）。",
    },
  ],
  similarQuestions: [
    {
      id: "sq1",
      content: "求二次函数 y = x² - 6x + 5 的顶点坐标。",
      difficulty: "easy",
      answer: "顶点坐标为 (3, -4)。配方：y = (x - 3)² - 9 + 5 = (x - 3)² - 4",
    },
    {
      id: "sq2", 
      content: "求二次函数 y = -2x² + 8x - 3 的顶点坐标和最大值。",
      difficulty: "medium",
      answer: "顶点坐标为 (2, 5)，最大值为 5。配方：y = -2(x - 2)² + 8 - 3 = -2(x - 2)² + 5",
    },
    {
      id: "sq3",
      content: "已知二次函数的顶点为 (2, -3)，且过点 (0, 1)，求该二次函数的解析式。",
      difficulty: "hard",
      answer: "设 y = a(x - 2)² - 3，代入 (0, 1)：1 = a(0-2)² - 3，解得 a = 1。所以 y = (x-2)² - 3 = x² - 4x + 1",
    },
  ],
};

export function useQuestions() {
  const [questions, setQuestions] = useState<WrongQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addQuestion = useCallback(async (data: { text?: string; images: File[]; subject: Subject }) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newQuestion: WrongQuestion = {
      id: `q_${Date.now()}`,
      content: data.text || "上传的图片题目（图像识别处理中...）",
      imageUrl: data.images.length > 0 ? URL.createObjectURL(data.images[0]) : undefined,
      subject: data.subject,
      createdAt: new Date(),
      analysis: mockAnalysis,
    };

    // Create flashcard from the question
    const newFlashcard: FlashCard = {
      id: `fc_${Date.now()}`,
      questionId: newQuestion.id,
      front: newQuestion.content,
      back: mockAnalysis.correctAnswer,
      difficulty: 3,
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setFlashcards(prev => [newFlashcard, ...prev]);
    setIsAnalyzing(false);

    return newQuestion;
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setFlashcards(prev => prev.filter(fc => fc.questionId !== id));
  }, []);

  const updateFlashcardDifficulty = useCallback((cardId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const difficultyMap = { easy: 1, medium: 3, hard: 5 };
    setFlashcards(prev => prev.map(fc => 
      fc.id === cardId 
        ? { ...fc, difficulty: difficultyMap[difficulty], lastReviewed: new Date() }
        : fc
    ));
  }, []);

  return {
    questions,
    flashcards,
    isAnalyzing,
    addQuestion,
    deleteQuestion,
    updateFlashcardDifficulty,
  };
}
