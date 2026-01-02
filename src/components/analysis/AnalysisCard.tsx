import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  Target,
  Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionAnalysis, SimilarQuestion } from "@/types";

interface AnalysisCardProps {
  analysis: QuestionAnalysis;
  originalQuestion: string;
}

export function AnalysisCard({ analysis, originalQuestion }: AnalysisCardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cause: true,
    answer: true,
    knowledge: false,
    practice: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Original Question */}
      <Card className="border-border/30 shadow-card bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="p-2 rounded-xl bg-muted/80">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <span>原题回顾</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed pl-11">{originalQuestion}</p>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <Card className="border-destructive/20 shadow-card bg-card/80 backdrop-blur-sm overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive to-destructive/30" />
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-destructive/5 transition-colors duration-300"
          onClick={() => toggleSection('cause')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300">
                <Target className="h-4 w-4 text-destructive" />
              </div>
              <span>错误归因</span>
            </div>
            <div className={cn(
              "p-1.5 rounded-lg bg-muted/50 transition-transform duration-300",
              expandedSections.cause && "rotate-180"
            )}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.cause && (
          <CardContent className="animate-fade-in pt-0">
            <div className="pl-11 pr-4 py-3 rounded-xl bg-destructive/5 border border-destructive/10">
              <p className="text-sm text-foreground leading-relaxed">{analysis.cause}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Correct Answer */}
      <Card className="border-success/20 shadow-card bg-card/80 backdrop-blur-sm overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success to-success/30" />
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-success/5 transition-colors duration-300"
          onClick={() => toggleSection('answer')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <span>正确解答</span>
            </div>
            <div className={cn(
              "p-1.5 rounded-lg bg-muted/50 transition-transform duration-300",
              expandedSections.answer && "rotate-180"
            )}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.answer && (
          <CardContent className="animate-fade-in pt-0">
            <div className="pl-11 pr-4 py-3 rounded-xl bg-success/5 border border-success/10">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{analysis.correctAnswer}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Knowledge Points */}
      <Card className="border-primary/20 shadow-card bg-card/80 backdrop-blur-sm overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-primary/5 transition-colors duration-300"
          onClick={() => toggleSection('knowledge')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span>知识点讲解</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({analysis.knowledgePoints.length} 个知识点)
              </span>
            </div>
            <div className={cn(
              "p-1.5 rounded-lg bg-muted/50 transition-transform duration-300",
              expandedSections.knowledge && "rotate-180"
            )}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.knowledge && (
          <CardContent className="space-y-4 animate-fade-in pt-0">
            {analysis.knowledgePoints.map((point, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 rounded-lg gradient-primary">
                    <Lightbulb className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground">{point.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-9">{point.explanation}</p>
                {point.examples && point.examples.length > 0 && (
                  <div className="mt-4 ml-9 pl-4 border-l-2 border-primary/30">
                    <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      示例
                    </p>
                    <div className="space-y-1.5">
                      {point.examples.map((example, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{example}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Practice Questions */}
      <Card className="border-accent/20 shadow-card bg-card/80 backdrop-blur-sm overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/30" />
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors duration-300"
          onClick={() => toggleSection('practice')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                <ListChecks className="h-4 w-4 text-accent" />
              </div>
              <span>同类练习题</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({analysis.similarQuestions.length} 道题)
              </span>
            </div>
            <div className={cn(
              "p-1.5 rounded-lg bg-muted/50 transition-transform duration-300",
              expandedSections.practice && "rotate-180"
            )}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.practice && (
          <CardContent className="space-y-4 animate-fade-in pt-0">
            {analysis.similarQuestions.map((question, index) => (
              <PracticeQuestion key={question.id} question={question} index={index} />
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function PracticeQuestion({ question, index }: { question: SimilarQuestion; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const difficultyConfig = {
    easy: { label: "基础", color: "bg-success/10 text-success border-success/30", gradient: "from-success/20 to-success/5" },
    medium: { label: "同等", color: "bg-primary/10 text-primary border-primary/30", gradient: "from-primary/20 to-primary/5" },
    hard: { label: "提升", color: "bg-warning/10 text-warning border-warning/30", gradient: "from-warning/20 to-warning/5" },
  };

  const config = difficultyConfig[question.difficulty];

  return (
    <div className={cn(
      "p-5 rounded-xl border border-border/50 bg-gradient-to-br transition-all duration-300 hover:shadow-card",
      config.gradient
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-muted text-xs font-bold">
            {index + 1}
          </span>
          练习题
        </span>
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", config.color)}>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-foreground mb-5 leading-relaxed">{question.content}</p>
      
      <div className="space-y-4">
        <div className="relative group">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="在这里写下你的答案..."
            className="w-full p-4 text-sm rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
            rows={3}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant={showAnswer ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="rounded-lg"
          >
            {showAnswer ? "隐藏答案" : "查看答案"}
          </Button>
        </div>
        {showAnswer && (
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 animate-scale-in">
            <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              参考答案
            </p>
            <p className="text-sm text-foreground leading-relaxed">{question.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
