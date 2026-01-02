import { Brain, Menu, X, LogOut, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "首页", path: "/" },
  { label: "上传错题", path: "/upload" },
  { label: "错题本", path: "/questions" },
  { label: "复习卡片", path: "/flashcards" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass background */}
      <div className="absolute inset-0 glass-strong" />
      
      {/* Border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative container flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow group-hover:shadow-float transition-shadow duration-300">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-background animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight">错题精灵</span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">AI 智能学习助手</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                location.pathname === item.path
                  ? "bg-card text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-glow transition-shadow">
              <Link to="/auth">
                <Sparkles className="w-4 h-4 mr-1.5" />
                登录 / 注册
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-xl hover:bg-muted"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden relative glass-strong border-t border-border/50 animate-slide-down">
          <div className="container py-4">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border/50 mt-2 pt-3">
                {user ? (
                  <Button variant="ghost" className="w-full justify-start rounded-xl" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </Button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium gradient-primary text-primary-foreground"
                  >
                    <Sparkles className="w-4 h-4" />
                    登录 / 注册
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
