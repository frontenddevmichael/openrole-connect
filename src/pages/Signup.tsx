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
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
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
        if (message.includes('username')) {
          message = 'This username is already taken. Please choose another.';
        } else {
          message = 'An account with this email already exists.';
        }
      }
      toast({
        title: 'Signup Failed',
        description: message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: 'Account created!',
      description: 'Welcome to OpenRole. Redirecting to your dashboard...',
    });

    // Redirect to dashboard
    setTimeout(() => {
      const dashboardPath = formData.role === 'organization' 
        ? '/organization-dashboard' 
        : '/student-dashboard';
      navigate(dashboardPath);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-sunken px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">O</span>
            </div>
          </Link>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-muted-foreground mt-2">Start your internship journey today</p>
        </div>

        {/* Form */}
        <div className="card-elevated p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="student"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.role === 'student' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <GraduationCap className={`w-6 h-6 ${formData.role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'student' ? 'text-primary' : ''}`}>
                    Student
                  </span>
                </Label>
                <Label
                  htmlFor="organization"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.role === 'organization' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <RadioGroupItem value="organization" id="organization" className="sr-only" />
                  <Building2 className={`w-6 h-6 ${formData.role === 'organization' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${formData.role === 'organization' ? 'text-primary' : ''}`}>
                    Organization
                  </span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={errors.username ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                {formData.role === 'organization' ? 'Organization Name' : 'Full Name'}
                <span className="text-muted-foreground text-xs ml-1">(optional)</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder={formData.role === 'organization' ? 'Acme Corp' : 'John Doe'}
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
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
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
