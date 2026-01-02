import { useState, useCallback } from 'react';
import { QuestionAnalysis, Subject } from '@/types';
import { toast } from 'sonner';

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-question`;

interface StreamingState {
  isStreaming: boolean;
  streamedContent: string;
  analysis: QuestionAnalysis | null;
  error: string | null;
}

export function useStreamingAnalysis() {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    streamedContent: '',
    analysis: null,
    error: null,
  });

  const analyzeQuestion = useCallback(async (data: {
    content: string;
    subject: Subject;
    imageUrls: string[];
  }): Promise<QuestionAnalysis> => {
    setState({
      isStreaming: true,
      streamedContent: '',
      analysis: null,
      error: null,
    });

    try {
      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          content: data.content,
          subject: data.subject,
          imageUrls: data.imageUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('无法获取响应流');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setState(prev => ({
                ...prev,
                streamedContent: fullContent,
              }));
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Parse the final JSON
      let analysis: QuestionAnalysis;
      try {
        let cleanedText = fullContent.trim();
        
        // Handle ```json ... ``` format
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '');
          cleanedText = cleanedText.replace(/\n?```\s*$/, '');
        }
        
        cleanedText = cleanedText.trim();
        const aiAnalysis = JSON.parse(cleanedText);

        analysis = {
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
      } catch (parseError) {
        console.error('Failed to parse analysis:', fullContent);
        throw new Error('解析AI响应失败');
      }

      setState(prev => ({
        ...prev,
        isStreaming: false,
        analysis,
      }));

      return analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分析过程中发生错误';
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isStreaming: false,
      streamedContent: '',
      analysis: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    analyzeQuestion,
    reset,
  };
}
