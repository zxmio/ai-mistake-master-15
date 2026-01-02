import { useState, useCallback } from "react";
import { WrongQuestion, FlashCard, QuestionAnalysis, Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useQuestions() {
  const [questions, setQuestions] = useState<WrongQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Upload images to storage and get URLs
  const uploadImages = async (images: File[], userId: string): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('question-images')
        .upload(fileName, image);
      
      if (error) {
        console.error('Upload error:', error);
        throw new Error('图片上传失败');
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(fileName);
      
      urls.push(publicUrl);
    }
    
    return urls;
  };

  const addQuestion = useCallback(async (data: { text?: string; images: File[]; subject: Subject }) => {
    setIsAnalyzing(true);
    
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('请先登录');
      }

      // Upload images if any
      let imageUrls: string[] = [];
      if (data.images.length > 0) {
        imageUrls = await uploadImages(data.images, user.id);
      }

      // Call AI analysis edge function
      const { data: analysisResult, error: functionError } = await supabase.functions.invoke('analyze-question', {
        body: {
          content: data.text || '',
          subject: data.subject,
          imageUrls: imageUrls,
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'AI分析失败');
      }

      if (analysisResult.error) {
        throw new Error(analysisResult.error);
      }

      const aiAnalysis = analysisResult.analysis;

      // Map AI response to our format
      const analysis: QuestionAnalysis = {
        cause: aiAnalysis.cause,
        correctAnswer: aiAnalysis.correctAnswer,
        knowledgePoints: aiAnalysis.knowledgePoints.map((kp: any) => ({
          title: kp.title,
          explanation: kp.explanation,
          examples: kp.examples || [],
        })),
        similarQuestions: aiAnalysis.similarQuestions.map((sq: any, index: number) => ({
          id: `sq_${Date.now()}_${index}`,
          content: sq.question,
          difficulty: sq.difficulty === 'basic' ? 'easy' : sq.difficulty === 'advanced' ? 'hard' : 'medium',
          answer: sq.hint,
        })),
      };

      // Save to database
      const { data: questionData, error: insertError } = await supabase
        .from('wrong_questions')
        .insert({
          user_id: user.id,
          subject: data.subject,
          content: data.text || '图片题目',
          image_urls: imageUrls,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('保存错题失败');
      }

      // Save analysis
      const { error: analysisError } = await supabase
        .from('question_analysis')
        .insert([{
          question_id: questionData.id,
          cause: analysis.cause,
          correct_answer: analysis.correctAnswer,
          knowledge_points: analysis.knowledgePoints as any,
          similar_questions: analysis.similarQuestions as any,
        }]);

      if (analysisError) {
        console.error('Analysis save error:', analysisError);
      }

      // Create flashcard
      const { error: flashcardError } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          question_id: questionData.id,
          front: data.text || '图片题目',
          back: analysis.correctAnswer,
          difficulty: 'medium',
        });

      if (flashcardError) {
        console.error('Flashcard save error:', flashcardError);
      }

      const newQuestion: WrongQuestion = {
        id: questionData.id,
        content: data.text || '图片题目',
        imageUrl: imageUrls[0],
        subject: data.subject,
        createdAt: new Date(questionData.created_at),
        analysis,
      };

      setQuestions(prev => [newQuestion, ...prev]);
      setIsAnalyzing(false);
      toast.success('AI分析完成！');

      return newQuestion;
    } catch (error) {
      setIsAnalyzing(false);
      const errorMessage = error instanceof Error ? error.message : '分析过程中发生错误';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const loadQuestions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: questionsData, error } = await supabase
        .from('wrong_questions')
        .select(`
          *,
          question_analysis (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Load questions error:', error);
        return;
      }

      const loadedQuestions: WrongQuestion[] = questionsData.map((q: any) => ({
        id: q.id,
        content: q.content,
        imageUrl: q.image_urls?.[0],
        subject: q.subject,
        createdAt: new Date(q.created_at),
        analysis: q.question_analysis ? {
          cause: q.question_analysis.cause,
          correctAnswer: q.question_analysis.correct_answer,
          knowledgePoints: q.question_analysis.knowledge_points || [],
          similarQuestions: q.question_analysis.similar_questions || [],
        } : undefined,
      }));

      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Load questions error:', error);
    }
  }, []);

  const loadFlashcards = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: flashcardsData, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Load flashcards error:', error);
        return;
      }

      const loadedFlashcards: FlashCard[] = flashcardsData.map((fc: any) => ({
        id: fc.id,
        questionId: fc.question_id,
        front: fc.front,
        back: fc.back,
        difficulty: fc.difficulty === 'easy' ? 1 : fc.difficulty === 'hard' ? 5 : 3,
        lastReviewed: fc.last_reviewed ? new Date(fc.last_reviewed) : undefined,
      }));

      setFlashcards(loadedFlashcards);
    } catch (error) {
      console.error('Load flashcards error:', error);
    }
  }, []);

  const deleteQuestion = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('wrong_questions')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('删除失败');
        return;
      }

      setQuestions(prev => prev.filter(q => q.id !== id));
      setFlashcards(prev => prev.filter(fc => fc.questionId !== id));
      toast.success('删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  }, []);

  const updateFlashcardDifficulty = useCallback(async (cardId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ 
          difficulty,
          last_reviewed: new Date().toISOString(),
          review_count: supabase.rpc ? undefined : 1, // Increment would need RPC
        })
        .eq('id', cardId);

      if (error) {
        console.error('Update flashcard error:', error);
        return;
      }

      const difficultyMap = { easy: 1, medium: 3, hard: 5 };
      setFlashcards(prev => prev.map(fc => 
        fc.id === cardId 
          ? { ...fc, difficulty: difficultyMap[difficulty], lastReviewed: new Date() }
          : fc
      ));
    } catch (error) {
      console.error('Update flashcard error:', error);
    }
  }, []);

  return {
    questions,
    flashcards,
    isAnalyzing,
    addQuestion,
    loadQuestions,
    loadFlashcards,
    deleteQuestion,
    updateFlashcardDifficulty,
  };
}
