import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Filter, BookOpen, LogIn, Sparkles, Brain, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { SUBJECTS, Subject } from "@/types";
import { cn } from "@/lib/utils";

export default function Questions() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { questions, loadQuestions, deleteQuestion } = useQuestions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "all">("all");

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user, loadQuestions]);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

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
              登录后即可查看你的错题本
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              错题本
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">我的错题本</h1>
            <p className="text-muted-foreground">
              共收录 <span className="font-semibold text-foreground">{questions.length}</span> 道错题
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-glow transition-all">
            <Link to="/upload">
              <Upload className="h-4 w-4 mr-2" />
              上传新错题
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="card-elevated p-6 space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索错题内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedSubject === "all"
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              全部
            </button>
            {SUBJECTS.map((subject) => (
              <button
                key={subject.value}
                onClick={() => setSelectedSubject(subject.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedSubject === subject.value
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {subject.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question List */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredQuestions.map((question, index) => (
              <div 
                key={question.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <QuestionCard 
                  question={question} 
                  onDelete={deleteQuestion}
                />
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-3xl opacity-10 rounded-full" />
              <div className="relative p-6 rounded-3xl bg-muted/50 mb-6">
                <FolderOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">错题本还是空的</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              上传你的第一道错题，开始智能学习之旅
            </p>
            <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-glow transition-all">
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                上传错题
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 rounded-3xl bg-muted/50 mb-6">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">未找到匹配的错题</h3>
            <p className="text-muted-foreground">
              尝试调整搜索条件或筛选条件
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
