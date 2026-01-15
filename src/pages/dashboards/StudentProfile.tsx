import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

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
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      field,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    }).eq('id', user.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      toast({ description: 'Profile updated successfully' });
      refreshProfile();
    }
    setIsSaving(false);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Error', description: 'Please upload a PDF file', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    const filePath = `${user.id}/${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Error', description: 'Failed to upload CV', variant: 'destructive' });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(filePath);
      await supabase.from('profiles').update({ cv_url: publicUrl }).eq('id', user.id);
      toast({ description: 'CV uploaded successfully' });
      refreshProfile();
    }
    setIsUploading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
        <div className="card-elevated p-6 space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <Label>Field of Interest</Label>
            <Input value={field} onChange={e => setField(e.target.value)} placeholder="e.g., Technology, Marketing" />
          </div>
          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python, Design" />
          </div>
          <div className="space-y-2">
            <Label>CV (PDF)</Label>
            <div className="flex items-center gap-4">
              <Input type="file" accept=".pdf" onChange={handleCvUpload} disabled={isUploading} />
              {profile?.cv_url && (
                <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  View Current CV
                </a>
              )}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
