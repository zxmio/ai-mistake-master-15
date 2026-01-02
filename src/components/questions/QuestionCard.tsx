import { useState } from "react";
import { ChevronRight, Trash2, Eye, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WrongQuestion } from "@/types";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionCardProps {
  question: WrongQuestion;
  onDelete?: (id: string) => void;
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(question.createdAt);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {question.subject}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </div>
              </div>
              <p className="text-sm text-foreground line-clamp-2 mb-2">
                {question.content}
              </p>
              {question.imageUrl && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  包含图片
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {question.analysis && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="text-primary"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  查看分析
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              错题分析详情
            </DialogTitle>
          </DialogHeader>
          {question.analysis && (
            <AnalysisCard 
              analysis={question.analysis} 
              originalQuestion={question.content} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
