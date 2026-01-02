import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FlashcardViewer } from "@/components/flashcard/FlashcardViewer";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Flashcards() {
  const { flashcards, loadFlashcards, updateFlashcardDifficulty } = useQuestions();

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  const stats = [
    { 
      icon: Target, 
      label: "总卡片数", 
      value: flashcards.length,
      color: "text-primary",
      bg: "bg-primary/10" 
    },
    { 
      icon: Clock, 
      label: "待复习", 
      value: flashcards.filter(f => f.difficulty >= 3).length,
      color: "text-warning",
      bg: "bg-warning/10"
    },
    { 
      icon: Brain, 
      label: "已掌握", 
      value: flashcards.filter(f => f.difficulty <= 2).length,
      color: "text-success",
      bg: "bg-success/10"
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">复习卡片</h1>
          <p className="text-muted-foreground">
            通过间隔复习法巩固知识点
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flashcard Viewer */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-primary" />
              开始复习
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flashcards.length > 0 ? (
              <FlashcardViewer 
                cards={flashcards}
                onComplete={updateFlashcardDifficulty}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">暂无复习卡片</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  上传错题后将自动生成复习卡片
                </p>
                <Button asChild variant="gradient">
                  <Link to="/upload">
                    <Upload className="h-4 w-4" />
                    上传错题
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-2">💡 复习小贴士</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 每天坚持复习 10-15 分钟效果最佳</li>
              <li>• 对于"再练练"的卡片会更频繁出现</li>
              <li>• "已掌握"的卡片会逐渐减少复习频率</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
