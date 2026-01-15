import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function OrganizationProfile() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [orgName, setOrgName] = useState(profile?.organization_name || '');
  const [description, setDescription] = useState(profile?.organization_description || '');
  const [website, setWebsite] = useState(profile?.organization_website || '');
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update({
      organization_name: orgName,
      organization_description: description,
      organization_website: website,
    }).eq('id', user.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } else {
      toast({ description: 'Profile updated' });
      refreshProfile();
    }
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Organization Profile</h1>
        <div className="card-elevated p-6 space-y-6">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input value={orgName} onChange={e => setOrgName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}Save
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
