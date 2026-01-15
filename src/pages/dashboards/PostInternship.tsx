import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const FIELDS = ['Technology', 'Finance', 'Marketing', 'Design', 'Healthcare', 'Engineering', 'Business', 'Education', 'Media', 'Other'];

export default function PostInternship() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', field: '', location: '', work_type: 'onsite' as const, duration: '', is_paid: false, stipend: '', requirements: '' });
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.field) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from('internships').insert({
      organization_id: user.id,
      title: form.title,
      description: form.description,
      field: form.field,
      location: form.location || null,
      work_type: form.work_type,
      duration: form.duration || null,
      is_paid: form.is_paid,
      stipend: form.stipend || null,
      requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : null,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ description: 'Internship posted!' });
      navigate('/organization-dashboard');
    }
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Post New Internship</h1>
        <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
          <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Field *</Label><Select value={form.field} onValueChange={v => setForm(f => ({ ...f, field: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Work Type</Label><Select value={form.work_type} onValueChange={v => setForm(f => ({ ...f, work_type: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="onsite">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Duration</Label><Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g., 3 months" /></div>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={form.is_paid} onCheckedChange={c => setForm(f => ({ ...f, is_paid: c }))} /><Label>Paid Internship</Label>
            {form.is_paid && <Input className="w-40" value={form.stipend} onChange={e => setForm(f => ({ ...f, stipend: e.target.value }))} placeholder="Stipend amount" />}
          </div>
          <div className="space-y-2"><Label>Requirements (one per line)</Label><Textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} rows={4} /></div>
          <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Post Internship</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
