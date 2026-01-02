import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Brain, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('请填写邮箱和密码');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('邮箱或密码错误');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('登录成功！');
      }
    } catch (error) {
      toast.error('登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('请填写邮箱和密码');
      return;
    }

    if (password.length < 6) {
      toast.error('密码长度至少6位');
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || email.split('@')[0],
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('该邮箱已注册，请直接登录');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('注册成功！');
      }
    } catch (error) {
      toast.error('注册过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-background" />
      <div className="fixed inset-0 gradient-mesh" />
      
      {/* Decorative blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <Card className="relative w-full max-w-md card-elevated border-border/50 animate-scale-in">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="relative mx-auto">
            <div className="absolute inset-0 gradient-primary blur-2xl opacity-40 rounded-full scale-150" />
            <div className="relative w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-float">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">错题精灵</CardTitle>
            <CardDescription className="text-base">AI 驱动的智能学习助手</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pb-8">
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                登录
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                注册
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-md hover:shadow-glow transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      登录中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      登录
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-sm font-medium">用户名（可选）</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="你的昵称"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">邮箱</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="至少6位字符"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-md hover:shadow-glow transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      注册中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      创建账号
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
