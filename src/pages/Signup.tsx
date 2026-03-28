import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, GraduationCap, Building2 } from 'lucide-react';
import { z } from 'zod';
import { AuthIllustration } from '@/components/svg/AuthIllustration';

const signupSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
  role: z.enum(['student', 'organization']),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.username,
      formData.role,
      formData.fullName
    );

    if (error) {
      let message = error.message;
      if (message.includes('duplicate key') || message.includes('already exists')) {
        message = message.includes('username')
          ? 'This username is already taken. Please choose another.'
          : 'An account with this email already exists.';
      }
      toast({ title: 'Signup Failed', description: message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    toast({ title: 'Account created!', description: 'Welcome to OpenRole. Redirecting...' });

    setTimeout(() => {
      const dashboardPath = formData.role === 'organization'
        ? '/organization-dashboard'
        : '/student-dashboard';
      navigate(dashboardPath);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-foreground relative items-center justify-center p-12">
        <AuthIllustration className="w-full max-w-md opacity-80" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-background/40 text-sm font-display">
            "The simplest way to discover internships that matter."
          </p>
          <p className="text-background/25 text-xs mt-2">— Organization on OpenRole</p>
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

          <h1 className="font-display text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground text-sm mb-8">Start your internship journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am a</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="student"
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.role === 'student'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <GraduationCap className={`w-5 h-5 ${formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'student' ? 'text-primary' : ''}`}>Student</span>
                </Label>
                <Label
                  htmlFor="organization"
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.role === 'organization'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value="organization" id="organization" className="sr-only" />
                  <Building2 className={`w-5 h-5 ${formData.role === 'organization' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'organization' ? 'text-primary' : ''}`}>Organization</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input id="username" placeholder="Choose a username" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} className={`rounded-lg h-11 ${errors.username ? 'border-destructive' : ''}`} disabled={isLoading} />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                {formData.role === 'organization' ? 'Organization Name' : 'Full Name'}
                <span className="text-muted-foreground text-xs ml-1">(optional)</span>
              </Label>
              <Input id="fullName" placeholder={formData.role === 'organization' ? 'Acme Corp' : 'John Doe'} value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className="rounded-lg h-11" disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`rounded-lg h-11 ${errors.email ? 'border-destructive' : ''}`} disabled={isLoading} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} className={`rounded-lg h-11 pr-10 ${errors.password ? 'border-destructive' : ''}`} disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-11 rounded-lg" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
