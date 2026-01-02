import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, SkipForward, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FlashCard } from "@/types";

interface FlashcardViewerProps {
  cards: FlashCard[];
  onComplete?: (cardId: string, difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function FlashcardViewer({ cards, onComplete }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative">
          <div className="absolute inset-0 gradient-primary rounded-full blur-2xl opacity-20 animate-pulse-soft" />
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-6">
            <Brain className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">暂无复习卡片</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          上传错题后将自动生成智能复习卡片，帮助你高效记忆
        </p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setCompletedCards(prev => new Set([...prev, currentCard.id]));
    onComplete?.(currentCard.id, difficulty);
    handleNext();
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            复习进度
          </span>
          <span className="font-semibold text-foreground px-3 py-1 rounded-full bg-primary/10">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted/50 overflow-hidden shadow-inner">
          <div 
            className="h-full gradient-primary transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={cn(
            "relative w-full min-h-[320px] transition-transform duration-700 ease-out",
            isFlipped && "rotate-y-180"
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 rounded-3xl border border-border/50 bg-card/90 backdrop-blur-sm p-8 shadow-card flex flex-col justify-center items-center text-center group-hover:shadow-float transition-shadow duration-300"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary rounded-t-3xl" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-glow">
                <RotateCcw className="h-3.5 w-3.5" />
                点击翻转
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-foreground leading-relaxed max-w-md">{currentCard.front}</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 rounded-3xl border border-success/30 bg-gradient-to-br from-success/5 to-success/10 backdrop-blur-sm p-8 shadow-card flex flex-col justify-center items-center text-center"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-success to-success/50 rounded-t-3xl" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success px-4 py-2 rounded-full bg-success/10 border border-success/20">
                ✓ 答案
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-success/10 mb-6">
              <Sparkles className="h-8 w-8 text-success" />
            </div>
            <p className="text-lg font-medium text-foreground leading-relaxed max-w-md">{currentCard.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {isFlipped ? (
          <div className="flex gap-3 flex-1 justify-center">
            <Button
              variant="outline"
              size="default"
              onClick={() => handleDifficultySelect('hard')}
              className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 flex-1 max-w-[120px] transition-all duration-300"
            >
              <ThumbsDown className="h-4 w-4 mr-1.5" />
              再练练
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => handleDifficultySelect('medium')}
              className="rounded-xl border-warning/30 text-warning hover:bg-warning/10 hover:border-warning/50 flex-1 max-w-[120px] transition-all duration-300"
            >
              <SkipForward className="h-4 w-4 mr-1.5" />
              还行
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={() => handleDifficultySelect('easy')}
              className="rounded-xl border-success/30 text-success hover:bg-success/10 hover:border-success/50 flex-1 max-w-[120px] transition-all duration-300"
            >
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              已掌握
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            点击卡片翻转查看答案
          </p>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
