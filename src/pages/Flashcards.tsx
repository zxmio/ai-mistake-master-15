import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FlashcardViewer } from "@/components/flashcard/FlashcardViewer";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, Clock, Target, Sparkles, Lightbulb, RotateCcw } from "lucide-react";
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
      gradient: "from-primary to-accent",
    },
    { 
      icon: Clock, 
      label: "待复习", 
      value: flashcards.filter(f => f.difficulty >= 3).length,
      gradient: "from-warning to-orange-400",
    },
    { 
      icon: Brain, 
      label: "已掌握", 
      value: flashcards.filter(f => f.difficulty <= 2).length,
      gradient: "from-success to-emerald-400",
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5" />
            复习卡片
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">智能复习</h1>
          <p className="text-lg text-muted-foreground">
            通过间隔复习法巩固知识点，让记忆更持久
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="card-elevated overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flashcard Viewer */}
        <Card className="card-elevated overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-xl gradient-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              开始复习
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {flashcards.length > 0 ? (
              <FlashcardViewer 
                cards={flashcards}
                onComplete={updateFlashcardDifficulty}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative">
                  <div className="absolute inset-0 gradient-primary blur-3xl opacity-10 rounded-full" />
                  <div className="relative p-6 rounded-3xl bg-muted/50 mb-6">
                    <Brain className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">暂无复习卡片</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  上传错题后将自动生成复习卡片
                </p>
                <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-glow transition-all">
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    上传错题
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="overflow-hidden border-primary/20">
          <div className="absolute inset-0 gradient-hero" />
          <CardContent className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">复习小贴士</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    每天坚持复习 10-15 分钟效果最佳
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    对于"再练练"的卡片会更频繁出现
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    "已掌握"的卡片会逐渐减少复习频率
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
