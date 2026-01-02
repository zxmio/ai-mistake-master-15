import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { UploadArea } from "@/components/upload/UploadArea";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/hooks/useAuth";
import { WrongQuestion, Subject } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, LogIn, Upload as UploadIcon, Sparkles, Brain } from "lucide-react";

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
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-soft">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">加载中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center space-y-8 py-20">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-3xl opacity-20 rounded-full" />
            <div className="relative w-20 h-20 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-float">
              <LogIn className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">请先登录</h1>
            <p className="text-muted-foreground text-lg">
              登录后即可上传错题，享受 AI 智能分析服务
            </p>
          </div>
          <Button 
            onClick={() => navigate('/auth')} 
            size="lg" 
            className="rounded-full gradient-primary text-primary-foreground shadow-float hover:shadow-glow transition-all h-14 px-10 font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            立即登录
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <UploadIcon className="h-3.5 w-3.5" />
            上传错题
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">上传你的错题</h1>
          <p className="text-lg text-muted-foreground">
            输入题目内容或上传图片，AI 将为你进行深度分析
          </p>
        </div>

        {!analyzedQuestion ? (
          <div className="card-elevated p-8 md:p-10 animate-fade-in">
            <UploadArea onSubmit={handleSubmit} isLoading={isAnalyzing} />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Success banner */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-success">AI 分析完成！</p>
                <p className="text-sm text-success/80">已为你生成详细的错题分析报告</p>
              </div>
            </div>

            {analyzedQuestion.analysis && (
              <AnalysisCard 
                analysis={analyzedQuestion.analysis}
                originalQuestion={analyzedQuestion.content}
              />
            )}

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleNewQuestion} 
                size="lg" 
                className="rounded-full gradient-primary text-primary-foreground shadow-float hover:shadow-glow transition-all h-14 px-10 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                继续上传新错题
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
