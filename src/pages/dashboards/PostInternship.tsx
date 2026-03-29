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
import { SpinnerIcon } from '@/components/icons';

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
    if (!form.title || !form.description || !form.field) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setIsSaving(true);
    const { error } = await supabase.from('internships').insert({
      organization_id: user.id, title: form.title, description: form.description, field: form.field, location: form.location || null, work_type: form.work_type, duration: form.duration || null, is_paid: form.is_paid, stipend: form.stipend || null, requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : null,
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else { toast({ description: 'Posted.' }); navigate('/organization-dashboard'); }
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <h1 className="font-serif text-2xl text-foreground mb-8">Post a role</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-md h-10 font-sans text-sm border-border bg-background" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Description *</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} className="rounded-md font-sans text-sm border-border bg-background" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Field *</Label><Select value={form.field} onValueChange={v => setForm(f => ({ ...f, field: v }))}><SelectTrigger className="rounded-md h-10 text-sm font-sans border-border"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Work type</Label><Select value={form.work_type} onValueChange={v => setForm(f => ({ ...f, work_type: v as any }))}><SelectTrigger className="rounded-md h-10 text-sm font-sans border-border"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="onsite">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="rounded-md h-10 font-sans text-sm border-border bg-background" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Duration</Label><Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 months" className="rounded-md h-10 font-sans text-sm border-border bg-background" /></div>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={form.is_paid} onCheckedChange={c => setForm(f => ({ ...f, is_paid: c }))} /><Label className="text-sm font-sans text-foreground">Paid</Label>
            {form.is_paid && <Input className="w-36 rounded-md h-10 font-sans text-sm border-border bg-background" value={form.stipend} onChange={e => setForm(f => ({ ...f, stipend: e.target.value }))} placeholder="Stipend" />}
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-sans font-medium text-foreground">Requirements (one per line)</Label><Textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} rows={4} className="rounded-md font-sans text-sm border-border bg-background" /></div>
          <Button type="submit" disabled={isSaving} className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92">
            {isSaving ? <SpinnerIcon size={16} className="mr-2" /> : null}Post role
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
