import { useState, useCallback } from "react";
import { Upload, Camera, FileText, X, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Subject Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">选择学科</label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSubject(s.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                subject === s.value
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          输入错题内容
        </label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入你的错题内容，包括题目和你的答案..."
          className="min-h-[120px] resize-none bg-card border-border focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          上传错题图片（支持批量上传）
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                拖拽图片到这里或点击上传
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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
            <div key={index} className="relative group animate-scale-in">
              <img
                src={preview}
                alt={`上传图片 ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || (!text && images.length === 0)}
        variant="gradient"
        size="xl"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            AI 正在分析中...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            开始 AI 分析
          </>
        )}
      </Button>
    </div>
  );
}
