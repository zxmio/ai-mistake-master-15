import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, Filter, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { SUBJECTS, Subject } from "@/types";
import { cn } from "@/lib/utils";

export default function Questions() {
  const { questions, deleteQuestion } = useQuestions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | "all">("all");

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">错题本</h1>
            <p className="text-muted-foreground">
              共收录 {questions.length} 道错题
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              上传新错题
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索错题内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedSubject === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              全部
            </button>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  selectedSubject === subject
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Question List */}
        {filteredQuestions.length > 0 ? (
          <div className="grid gap-4">
            {filteredQuestions.map((question, index) => (
              <div 
                key={question.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <QuestionCard 
                  question={question} 
                  onDelete={deleteQuestion}
                />
              </div>
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">错题本还是空的</h3>
            <p className="text-sm text-muted-foreground mb-4">
              上传你的第一道错题，开始智能学习之旅
            </p>
            <Button asChild variant="gradient">
              <Link to="/upload">
                <Upload className="h-4 w-4" />
                上传错题
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">未找到匹配的错题</h3>
            <p className="text-sm text-muted-foreground">
              尝试调整搜索条件或筛选条件
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
