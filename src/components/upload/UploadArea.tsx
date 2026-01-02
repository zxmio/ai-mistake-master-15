import { useState, useCallback } from "react";
import { Upload, Camera, FileText, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SUBJECTS, Subject } from "@/types";

interface UploadAreaProps {
  onSubmit: (data: { text?: string; images: File[]; subject: Subject }) => void;
  isLoading?: boolean;
}

export function UploadArea({ onSubmit, isLoading }: UploadAreaProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [subject, setSubject] = useState<Subject>("math");
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = () => {
    if (!text && images.length === 0) return;
    onSubmit({ text: text || undefined, images, subject });
  };

  return (
    <div className="space-y-8">
      {/* Subject Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md gradient-primary text-primary-foreground text-xs font-bold">1</span>
          选择学科
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSubject(s.value)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border",
                subject === s.value
                  ? "gradient-primary text-primary-foreground shadow-glow border-transparent scale-105"
                  : "bg-card/80 backdrop-blur-sm text-foreground border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:scale-102"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md gradient-primary text-primary-foreground text-xs font-bold">2</span>
          <FileText className="h-4 w-4 text-primary" />
          输入错题内容
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 gradient-primary rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入你的错题内容，包括题目和你的答案..."
            className="relative min-h-[140px] resize-none bg-card/80 backdrop-blur-sm border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md gradient-primary text-primary-foreground text-xs font-bold">3</span>
          <Camera className="h-4 w-4 text-primary" />
          上传错题图片
          <span className="text-xs text-muted-foreground font-normal">（支持批量上传）</span>
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 text-center group",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border/50 hover:border-primary/50 hover:bg-primary/5 bg-card/50 backdrop-blur-sm"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              isDragging 
                ? "gradient-primary shadow-glow" 
                : "bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors duration-300",
                isDragging ? "text-primary-foreground" : "text-primary"
              )} />
            </div>
            <div>
              <p className="text-base font-medium text-foreground mb-1">
                拖拽图片到这里或点击上传
              </p>
              <p className="text-sm text-muted-foreground">
                支持 JPG、PNG 格式，可同时上传多张
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div 
              key={index} 
              className="relative group animate-scale-in rounded-xl overflow-hidden shadow-card hover:shadow-float transition-all duration-300"
            >
              <img
                src={preview}
                alt={`上传图片 ${index + 1}`}
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                图片 {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!text && images.length === 0)}
          variant="gradient"
          size="xl"
          className="w-full group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                AI 正在分析中...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                开始 AI 智能分析
              </>
            )}
          </span>
        </Button>
        {!isLoading && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            AI 将分析错题并生成个性化学习建议
          </p>
        )}
      </div>
    </div>
  );
}
