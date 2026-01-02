import { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LatexRenderer } from "@/components/ui/latex-renderer";
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
    <div className="space-y-4 animate-fade-in">
      {/* Original Question */}
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-lg bg-muted">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            原题回顾
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{originalQuestion}</p>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <Card className="border-destructive/20 shadow-md">
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
          onClick={() => toggleSection('cause')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              错误归因
            </div>
            {expandedSections.cause ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedSections.cause && (
          <CardContent className="animate-slide-up">
            <div className="text-sm text-foreground leading-relaxed">
              <LatexRenderer content={analysis.cause} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Correct Answer */}
      <Card className="border-success/20 shadow-md">
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
          onClick={() => toggleSection('answer')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              正确解答
            </div>
            {expandedSections.answer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedSections.answer && (
          <CardContent className="animate-slide-up">
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              <LatexRenderer content={analysis.correctAnswer} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Knowledge Points */}
      <Card className="border-primary/20 shadow-md">
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
          onClick={() => toggleSection('knowledge')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              知识点讲解
            </div>
            {expandedSections.knowledge ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedSections.knowledge && (
          <CardContent className="space-y-4 animate-slide-up">
            {analysis.knowledgePoints.map((point, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <h4 className="font-medium text-foreground"><LatexRenderer content={point.title} /></h4>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <LatexRenderer content={point.explanation} />
                </div>
                {point.examples && point.examples.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-primary/30">
                    <p className="text-xs font-medium text-primary mb-1">例子：</p>
                    {point.examples.map((example, i) => (
                      <div key={i} className="text-sm text-muted-foreground">
                        <LatexRenderer content={example} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Practice Questions */}
      <Card className="border-accent/20 shadow-md">
        <CardHeader 
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
          onClick={() => toggleSection('practice')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <ListChecks className="h-4 w-4 text-accent" />
              </div>
              同类练习题
            </div>
            {expandedSections.practice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {expandedSections.practice && (
          <CardContent className="space-y-4 animate-slide-up">
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
    easy: { label: "基础", color: "bg-success/10 text-success border-success/20" },
    medium: { label: "同等", color: "bg-primary/10 text-primary border-primary/20" },
    hard: { label: "提升", color: "bg-warning/10 text-warning border-warning/20" },
  };

  const config = difficultyConfig[question.difficulty];

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">练习 {index + 1}</span>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", config.color)}>
          {config.label}
        </span>
      </div>
      <div className="text-sm text-foreground mb-4"><LatexRenderer content={question.content} /></div>
      
      <div className="space-y-3">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="在这里写下你的答案..."
          className="w-full p-3 text-sm rounded-lg border border-input bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={2}
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "隐藏答案" : "查看答案"}
          </Button>
        </div>
        {showAnswer && (
          <div className="p-3 rounded-lg bg-success/5 border border-success/20 animate-scale-in">
            <p className="text-xs font-medium text-success mb-1">参考答案：</p>
            <div className="text-sm text-foreground"><LatexRenderer content={question.answer} /></div>
          </div>
        )}
      </div>
    </div>
  );
}
