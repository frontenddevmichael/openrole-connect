import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, SpinnerIcon } from '@/components/icons';
import { z } from 'zod';

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
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    toast({ title: 'Welcome back.' });

    if (loginIsAdmin) {
      navigate('/admin-dashboard');
    } else {
      setTimeout(() => { setIsLoading(false); }, 500);
    }
  };

  if (profile) {
    const dashboardPath = profile.role === 'organization' ? '/organization-dashboard' : '/student-dashboard';
    navigate(dashboardPath);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-serif text-lg text-foreground block mb-10">
          OpenRole
        </Link>

        <h1 className="font-serif text-2xl text-foreground mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground font-sans mb-8">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-sans font-medium text-foreground">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`rounded-md h-10 font-sans text-sm border-border bg-background ${errors.username ? 'border-destructive' : ''}`}
              disabled={isLoading}
            />
            {errors.username && <p className="text-xs text-destructive font-sans">{errors.username}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-sans font-medium text-foreground">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`rounded-md h-10 font-sans text-sm pr-10 border-border bg-background ${errors.password ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive font-sans">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full h-10 rounded-md font-sans text-sm bg-primary text-primary-foreground hover:opacity-92" disabled={isLoading}>
            {isLoading ? <><SpinnerIcon size={16} className="mr-2" /> Signing in…</> : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
          No account?{' '}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
