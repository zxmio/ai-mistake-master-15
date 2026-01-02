import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface StreamingAnalysisProps {
  content: string;
  isStreaming: boolean;
}

export function StreamingAnalysis({ content, isStreaming }: StreamingAnalysisProps) {
  if (!content && !isStreaming) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          AI 正在分析中...
          {isStreaming && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono text-foreground/80 break-words">
            {content || '正在连接 AI 服务...'}
            {isStreaming && <span className="animate-pulse">▊</span>}
          </pre>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          分析完成后将自动显示结果卡片
        </p>
      </CardContent>
    </Card>
  );
}
