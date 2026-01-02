import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, SkipForward } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <RotateCcw className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">暂无复习卡片</h3>
        <p className="text-sm text-muted-foreground">上传错题后将自动生成复习卡片</p>
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
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">复习进度</span>
          <span className="font-medium text-foreground">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={cn(
            "relative w-full min-h-[300px] transition-transform duration-500 transform-style-3d",
            isFlipped && "rotate-y-180"
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 backface-hidden rounded-2xl border border-border bg-card p-8 shadow-lg flex flex-col justify-center items-center text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-medium text-primary mb-4 px-3 py-1 rounded-full bg-primary/10">
              点击翻转查看答案
            </span>
            <p className="text-lg text-foreground leading-relaxed">{currentCard.front}</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden rounded-2xl border border-success/30 bg-success/5 p-8 shadow-lg flex flex-col justify-center items-center text-center"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-xs font-medium text-success mb-4 px-3 py-1 rounded-full bg-success/10">
              答案
            </span>
            <p className="text-lg text-foreground leading-relaxed">{currentCard.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {isFlipped ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDifficultySelect('hard')}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              再练练
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDifficultySelect('medium')}
              className="border-warning/30 text-warning hover:bg-warning/10"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              还行
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDifficultySelect('easy')}
              className="border-success/30 text-success hover:bg-success/10"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              已掌握
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">点击卡片翻转</p>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
