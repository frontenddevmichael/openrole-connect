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
import { SpinnerIcon } from '@/components/icons';

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
    const { error } = await supabase.from('profiles').update({ organization_name: orgName, organization_description: description, organization_website: website }).eq('id', user.id);
    if (error) { toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' }); }
    else { toast({ description: 'Updated.' }); refreshProfile(); }
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <h1 className="font-serif text-2xl text-foreground mb-8">Organization profile</h1>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Name</Label>
            <Input value={orgName} onChange={e => setOrgName(e.target.value)} className="rounded-md h-10 font-sans text-sm border-border bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="rounded-md font-sans text-sm border-border bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-sans font-medium text-foreground">Website</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className="rounded-md h-10 font-sans text-sm border-border bg-background" />
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92">
            {isSaving ? <SpinnerIcon size={16} className="mr-2" /> : null}Save
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
