import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { AuthIllustration } from '@/components/svg/AuthIllustration';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: { username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'username' | 'password'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const { error, isAdmin: loginIsAdmin } = await signIn(username, password);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Welcome back!',
      description: 'You have been logged in successfully.',
    });

    if (loginIsAdmin) {
      navigate('/admin-dashboard');
    } else {
      setTimeout(() => { setIsLoading(false); }, 500);
    }
  };

  if (profile) {
    const dashboardPath = profile.role === 'organization'
      ? '/organization-dashboard'
      : '/student-dashboard';
    navigate(dashboardPath);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-foreground relative items-center justify-center p-12">
        <AuthIllustration className="w-full max-w-md opacity-80" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-background/40 text-sm font-display">
            "OpenRole connected me with an internship that changed my career trajectory."
          </p>
          <p className="text-background/25 text-xs mt-2">— Student on OpenRole</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-display">O</span>
            </div>
            <span className="font-display font-semibold text-foreground">OpenRole</span>
          </Link>

          <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`rounded-lg h-11 ${errors.username ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`rounded-lg h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
