import { Link } from "react-router-dom";
import { 
  Upload, 
  Brain, 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const features = [
  {
    icon: Upload,
    title: "便捷上传",
    description: "支持文本输入和拍照上传，批量处理多道错题",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI 智能分析",
    description: "深度分析错误原因，提供结构化的解题思路",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "知识点讲解",
    description: "通俗易懂的知识点解释，配合举一反三练习",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: RotateCcw,
    title: "Flashcard 复习",
    description: "智能间隔复习，巩固薄弱知识点",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const stats = [
  { value: "98%", label: "分析准确率" },
  { value: "3x", label: "学习效率提升" },
  { value: "10+", label: "支持学科" },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-16 pb-12">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 text-center">
          <div className="absolute inset-0 gradient-hero rounded-3xl -z-10" />
          
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI 驱动的智能学习助手
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              让每一道错题
              <span className="gradient-primary bg-clip-text text-transparent"> 变成进步的阶梯</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              上传你的错题，AI 帮你分析原因、讲解知识点、生成同类练习，
              让学习更高效，让进步更清晰可见
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="gradient" size="xl">
                <Link to="/upload">
                  <Upload className="h-5 w-5" />
                  开始上传错题
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/questions">
                  查看错题本
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">核心功能</h2>
            <p className="text-muted-foreground mt-2">全方位助力你的学习提升</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">使用流程</h2>
            <p className="text-muted-foreground mt-2">简单三步，开启高效学习</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: 1, icon: Upload, title: "上传错题", desc: "输入文字或拍照上传" },
              { step: 2, icon: Target, title: "AI 分析", desc: "智能识别问题与知识点" },
              { step: 3, icon: TrendingUp, title: "巩固提升", desc: "练习同类题目与复习" },
            ].map((item, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center p-6 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-6xl font-bold text-muted/20">
                  {item.step}
                </div>
                <div className="relative z-10 p-4 rounded-2xl gradient-primary mb-4">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 px-6 rounded-3xl gradient-hero">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            准备好提升学习效率了吗？
          </h2>
          <p className="text-muted-foreground mb-6">
            立即开始，让 AI 成为你的专属学习助手
          </p>
          <Button asChild variant="gradient" size="xl">
            <Link to="/upload">
              立即体验
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </div>
    </Layout>
  );
}
