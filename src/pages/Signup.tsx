import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, SpinnerIcon } from '@/components/icons';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'At least 3 characters').max(20, 'At most 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
  fullName: z.string().optional(),
  role: z.enum(['student', 'organization']),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({ username: '', email: '', password: '', fullName: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.username, formData.role, formData.fullName);

    if (error) {
      let message = error.message;
      if (message.includes('duplicate key') || message.includes('already exists')) {
        message = message.includes('username') ? 'Username taken.' : 'Email already registered.';
      }
      toast({ title: 'Signup failed', description: message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    toast({ title: 'Account created.', description: 'Redirecting…' });
    setTimeout(() => {
      navigate(formData.role === 'organization' ? '/organization-dashboard' : '/student-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-serif text-lg text-foreground block mb-10">
          OpenRole
        </Link>

        <h1 className="font-serif text-2xl text-foreground mb-2">Create an account</h1>
        <p className="text-sm text-muted-foreground font-sans mb-8">Takes about thirty seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">I am a</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => handleChange('role', value)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="student"
                className={`flex items-center justify-center py-3 rounded-md border cursor-pointer transition-all font-sans text-sm ${
                  formData.role === 'student' ? 'border-primary text-foreground' : 'border-border text-muted-foreground hover:border-foreground/20'
                }`}
              >
                <RadioGroupItem value="student" id="student" className="sr-only" />
                Student
              </Label>
              <Label
                htmlFor="organization"
                className={`flex items-center justify-center py-3 rounded-md border cursor-pointer transition-all font-sans text-sm ${
                  formData.role === 'organization' ? 'border-primary text-foreground' : 'border-border text-muted-foreground hover:border-foreground/20'
                }`}
              >
                <RadioGroupItem value="organization" id="organization" className="sr-only" />
                Organization
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-sans font-medium text-foreground">Username</Label>
            <Input id="username" placeholder="choose a username" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} className={`rounded-md h-10 font-sans text-sm border-border bg-background ${errors.username ? 'border-destructive' : ''}`} disabled={isLoading} />
            {errors.username && <p className="text-xs text-destructive font-sans">{errors.username}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-sans font-medium text-foreground">
              {formData.role === 'organization' ? 'Organization name' : 'Full name'}
              <span className="text-muted-foreground text-xs ml-1">(optional)</span>
            </Label>
            <Input id="fullName" placeholder={formData.role === 'organization' ? 'Acme Corp' : 'your name'} value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className="rounded-md h-10 font-sans text-sm border-border bg-background" disabled={isLoading} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-sans font-medium text-foreground">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`rounded-md h-10 font-sans text-sm border-border bg-background ${errors.email ? 'border-destructive' : ''}`} disabled={isLoading} />
            {errors.email && <p className="text-xs text-destructive font-sans">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-sans font-medium text-foreground">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="at least 6 characters" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} className={`rounded-md h-10 font-sans text-sm pr-10 border-border bg-background ${errors.password ? 'border-destructive' : ''}`} disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive font-sans">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full h-10 rounded-md font-sans text-sm bg-primary text-primary-foreground hover:opacity-92" disabled={isLoading}>
            {isLoading ? <><SpinnerIcon size={16} className="mr-2" /> Creating…</> : 'Create account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
