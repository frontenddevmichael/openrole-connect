import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrashIcon } from '@/components/icons';

export default function AdminModerate() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('internships').select('*, profiles!internships_organization_id_fkey(organization_name, username)').order('created_at', { ascending: false }).then(({ data }) => setInternships(data || []));
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from('internships').delete().eq('id', id);
    setInternships(prev => prev.filter(i => i.id !== id));
    toast({ description: 'Removed.' });
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('internships').update({ is_active: !current }).eq('id', id);
    setInternships(prev => prev.map(i => i.id === id ? { ...i, is_active: !current } : i));
    toast({ description: current ? 'Deactivated.' : 'Activated.' });
  };

  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <h1 className="font-serif text-2xl text-foreground mb-8">Moderate listings</h1>
      <div className="space-y-3">
        {internships.map(i => (
          <div key={i.id} className="card-elevated p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">{i.title}</p>
              <p className="text-xs text-muted-foreground font-sans">{i.profiles?.organization_name || i.profiles?.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={i.is_active ? 'default' : 'secondary'} className="text-xs font-sans">{i.is_active ? 'Active' : 'Inactive'}</Badge>
              <Button variant="outline" size="sm" onClick={() => toggleActive(i.id, i.is_active)} className="font-sans text-xs rounded-md border-border">{i.is_active ? 'Deactivate' : 'Activate'}</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(i.id)} className="rounded-md"><TrashIcon size={14} /></Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
