import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { UploadArea } from "@/components/upload/UploadArea";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/hooks/useAuth";
import { WrongQuestion, Subject } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, LogIn } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { addQuestion, isAnalyzing } = useQuestions();
  const [analyzedQuestion, setAnalyzedQuestion] = useState<WrongQuestion | null>(null);

  const handleSubmit = async (data: { text?: string; images: File[]; subject: Subject }) => {
    try {
      const question = await addQuestion(data);
      setAnalyzedQuestion(question);
    } catch (error) {
      // Error already handled in useQuestions
    }
  };

  const handleNewQuestion = () => {
    setAnalyzedQuestion(null);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">加载中...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center space-y-6 py-16">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">请先登录</h1>
          <p className="text-muted-foreground">
            登录后即可上传错题，享受 AI 智能分析服务
          </p>
          <Button onClick={() => navigate('/auth')} variant="gradient" size="lg">
            立即登录
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">上传错题</h1>
          <p className="text-muted-foreground">
            输入题目内容或上传图片，AI 将为你进行深度分析
          </p>
        </div>

        {!analyzedQuestion ? (
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
            <UploadArea onSubmit={handleSubmit} isLoading={isAnalyzing} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-success">AI 分析完成！</span>
            </div>

            {analyzedQuestion.analysis && (
              <AnalysisCard 
                analysis={analyzedQuestion.analysis}
                originalQuestion={analyzedQuestion.content}
              />
            )}

            <div className="flex justify-center pt-4">
              <Button onClick={handleNewQuestion} variant="gradient" size="lg">
                <Plus className="h-5 w-5" />
                继续上传新错题
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
