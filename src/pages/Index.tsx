import { Link } from "react-router-dom";
import { 
  Upload, 
  Brain, 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Stars
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const features = [
  {
    icon: Upload,
    title: "便捷上传",
    description: "支持文本输入和拍照上传，批量处理多道错题",
    gradient: "from-primary to-accent",
  },
  {
    icon: Brain,
    title: "AI 智能分析",
    description: "深度分析错误原因，提供结构化的解题思路",
    gradient: "from-accent to-pink-500",
  },
  {
    icon: BookOpen,
    title: "知识点讲解",
    description: "通俗易懂的知识点解释，配合举一反三练习",
    gradient: "from-success to-emerald-400",
  },
  {
    icon: RotateCcw,
    title: "Flashcard 复习",
    description: "智能间隔复习，巩固薄弱知识点",
    gradient: "from-warning to-orange-400",
  },
];

const stats = [
  { value: "98%", label: "分析准确率", icon: Target },
  { value: "3x", label: "学习效率提升", icon: TrendingUp },
  { value: "10+", label: "支持学科", icon: BookOpen },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-24 pb-16">
        {/* Hero Section */}
        <section className="relative pt-8 md:pt-16 pb-8">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="h-4 w-4 text-primary opacity-50" />
                </div>
              </div>
              <span className="text-sm font-semibold gradient-text">AI 驱动的智能学习助手</span>
            </div>
            
            {/* Heading */}
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              让每一道错题
              <br />
              <span className="gradient-text">变成进步的阶梯</span>
            </h1>
            
            {/* Description */}
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              上传你的错题，AI 帮你分析原因、讲解知识点、生成同类练习，
              让学习更高效，让进步更清晰可见
            </p>
            
            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-float hover:shadow-glow transition-all duration-300 h-14 px-8 text-base font-semibold group">
                <Link to="/upload">
                  <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  开始上传错题
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-8 text-base font-semibold border-2 hover:bg-muted/50 group">
                <Link to="/questions">
                  查看错题本
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="relative group animate-slide-up"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="relative p-6 rounded-2xl card-elevated text-center hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Stars className="h-3.5 w-3.5" />
              核心功能
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">全方位助力学习提升</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">四大核心功能，覆盖学习全流程</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover-lift animate-slide-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardContent className="relative p-6 space-y-4">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              <Zap className="h-3.5 w-3.5" />
              使用流程
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">简单三步，开启高效学习</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, icon: Upload, title: "上传错题", desc: "输入文字或拍照上传", color: "from-primary to-primary" },
              { step: 2, icon: Brain, title: "AI 分析", desc: "智能识别问题与知识点", color: "from-accent to-accent" },
              { step: 3, icon: TrendingUp, title: "巩固提升", desc: "练习同类题目与复习", color: "from-success to-success" },
            ].map((item, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${0.7 + index * 0.15}s` }}
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
                )}
                
                {/* Step number */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-8xl font-black text-muted/10 select-none">
                  {item.step}
                </div>
                
                {/* Icon */}
                <div className={`relative z-10 p-5 rounded-3xl bg-gradient-to-br ${item.color} shadow-lg mb-6`}>
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="relative p-12 md:p-16 rounded-3xl gradient-hero border border-primary/10">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />
            
            <div className="relative text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                准备好提升学习效率了吗？
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                立即开始，让 AI 成为你的专属学习助手
              </p>
              <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-float hover:shadow-glow transition-all duration-300 h-14 px-10 text-base font-semibold">
                <Link to="/upload">
                  立即体验
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
