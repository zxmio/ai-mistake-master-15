import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ImageIcon,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionAnalysis, SimilarQuestion, Subject } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisCardProps {
  analysis: QuestionAnalysis;
  originalQuestion: string;
  subject: Subject;
}

export function AnalysisCard({ analysis, originalQuestion, subject }: AnalysisCardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    card: true,
    cause: true,
    answer: true,
    knowledge: false,
    practice: false,
  });

  const [cardUrl, setCardUrl] = useState<string | undefined>(analysis.knowledgeCardUrl);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownloadCard = () => {
    if (cardUrl) {
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `knowledge-card-${Date.now()}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateCard = async () => {
    if (isGeneratingCard) return;

    try {
      setIsGeneratingCard(true);
      toast.info('正在生成知识卡片图片...');

      const { data, error } = await supabase.functions.invoke('generate-knowledge-card', {
        body: {
          subject,
          originalQuestion,
          knowledgePoints: analysis.knowledgePoints,
          cause: analysis.cause,
        },
      });

      if (error) {
        console.error('Generate card error:', error);
        throw new Error(error.message || '生成失败');
      }

      const imageUrl = (data as any)?.imageUrl as string | undefined;
      if (!imageUrl) {
        throw new Error('生成失败：未返回图片');
      }

      setCardUrl(imageUrl);
      analysis.knowledgeCardUrl = imageUrl;
      setExpandedSections(prev => ({ ...prev, card: true }));
      toast.success('知识卡片已生成');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '生成知识卡片失败';
      toast.error(msg);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* AI Knowledge Card (manual generation) */}
      <Card className="border-primary/30 shadow-glow overflow-hidden">
        <CardHeader
          className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          onClick={() => toggleSection('card')}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                AI 知识卡片
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cardUrl ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadCard();
                  }}
                  className="h-8 px-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  保存
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateCard();
                  }}
                  disabled={isGeneratingCard}
                  className="h-8"
                >
                  {isGeneratingCard ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      生成中
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      生成卡片
                    </>
                  )}
                </Button>
              )}

              {expandedSections.card ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardTitle>
        </CardHeader>

        {expandedSections.card && (
          <CardContent className="p-4 animate-slide-up">
            {cardUrl ? (
              <div className="relative rounded-xl overflow-hidden shadow-card">
                <img
                  src={cardUrl}
                  alt="AI 生成的知识点讲解卡片"
                  className="w-full h-auto object-contain max-h-[500px] bg-muted"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  AI 生成
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-foreground font-medium">还没有图片版知识卡片</p>
                <p className="text-xs text-muted-foreground mt-1">点击右上角“生成卡片”即可生成（不会影响文字分析结果）</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

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
            <p className="text-sm text-foreground leading-relaxed">{analysis.cause}</p>
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
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{analysis.correctAnswer}</p>
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
                  <h4 className="font-medium text-foreground">{point.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.explanation}</p>
                {point.examples && point.examples.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-primary/30">
                    <p className="text-xs font-medium text-primary mb-1">例子：</p>
                    {point.examples.map((example, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{example}</p>
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
      <p className="text-sm text-foreground mb-4">{question.content}</p>
      
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
            <p className="text-sm text-foreground">{question.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
