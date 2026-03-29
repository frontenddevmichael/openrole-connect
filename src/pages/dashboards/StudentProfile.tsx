import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SpinnerIcon } from '@/components/icons';

export default function StudentProfile() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [field, setField] = useState(profile?.field || '');
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (isLoading) return null;
  if (!user || profile?.role !== 'student') return <Navigate to="/login" />;

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName, field, skills: skills.split(',').map(s => s.trim()).filter(Boolean) }).eq('id', user.id);
    if (error) { toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' }); }
    else { toast({ description: 'Updated.' }); refreshProfile(); }
    setIsSaving(false);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast({ title: 'Error', description: 'PDF only.', variant: 'destructive' }); return; }
    setIsUploading(true);
    const filePath = `${user.id}/${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file);
    if (uploadError) { toast({ title: 'Error', description: 'Upload failed.', variant: 'destructive' }); }
    else {
      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(filePath);
      await supabase.from('profiles').update({ cv_url: publicUrl }).eq('id', user.id);
      toast({ description: 'CV uploaded.' }); refreshProfile();
    }
    setIsUploading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <h1 className="font-serif text-2xl text-foreground mb-8">Profile</h1>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Full name</Label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="rounded-md h-10 font-sans text-sm border-border bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Field of interest</Label>
            <Input value={field} onChange={e => setField(e.target.value)} placeholder="e.g. Technology" className="rounded-md h-10 font-sans text-sm border-border bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Skills (comma-separated)</Label>
            <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python, Design" className="rounded-md h-10 font-sans text-sm border-border bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">CV (PDF)</Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept=".pdf" onChange={handleCvUpload} disabled={isUploading} className="rounded-md font-sans text-sm border-border bg-background" />
              {profile?.cv_url && (
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-sans whitespace-nowrap">
                  View CV
                </a>
              )}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92">
            {isSaving ? <><SpinnerIcon size={16} className="mr-2" /> Saving…</> : 'Save'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
