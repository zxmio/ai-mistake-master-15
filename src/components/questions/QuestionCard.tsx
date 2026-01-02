import { useState } from "react";
import { ChevronRight, Trash2, Eye, Calendar, BookOpen } from "lucide-react";
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
      <Card className="group h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 flex flex-col">
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Header with subject and date */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {getSubjectLabel(question.subject)}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 mb-3">
            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Image indicator */}
          {question.imageUrl && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 px-2 py-1.5 bg-muted/50 rounded-md w-fit">
              <Eye className="h-3.5 w-3.5" />
              包含图片
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
            {question.analysis ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="text-primary hover:bg-primary/10 -ml-2"
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                查看分析
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">暂无分析</span>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(question.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
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
              subject={question.subject}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
