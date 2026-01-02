import { useState } from "react";
import { ChevronRight, Trash2, Eye, Calendar, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WrongQuestion, getSubjectLabel } from "@/types";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
      <Card className={cn(
        "group h-full flex flex-col overflow-hidden",
        "bg-card/80 backdrop-blur-sm border-border/30",
        "hover:shadow-float hover:border-primary/30 hover:-translate-y-1",
        "transition-all duration-300"
      )}>
        {/* Top gradient accent */}
        <div className="h-1 gradient-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-5 flex flex-col flex-1">
          {/* Header with subject and date */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold",
              "bg-gradient-to-r from-primary/15 to-accent/15 text-primary",
              "border border-primary/20"
            )}>
              {getSubjectLabel(question.subject)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 mb-4">
            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Image indicator */}
          {question.imageUrl && (
            <div className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground mb-4",
              "px-3 py-2 bg-muted/50 rounded-xl w-fit",
              "border border-border/50"
            )}>
              <Eye className="h-3.5 w-3.5" />
              包含图片
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
            {question.analysis ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className={cn(
                  "text-primary hover:bg-primary/10 -ml-2 rounded-xl",
                  "group/btn transition-all duration-300"
                )}
              >
                <Sparkles className="h-4 w-4 mr-1.5 group-hover/btn:animate-pulse" />
                查看分析
                <ChevronRight className="h-4 w-4 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/50">
                暂无分析
              </span>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(question.id)}
                className={cn(
                  "h-9 w-9 rounded-xl",
                  "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  "opacity-0 group-hover:opacity-100 transition-all duration-300"
                )}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl gradient-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
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
