import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

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
    toast({ description: 'Internship removed' });
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('internships').update({ is_active: !current }).eq('id', id);
    setInternships(prev => prev.map(i => i.id === id ? { ...i, is_active: !current } : i));
    toast({ description: current ? 'Internship deactivated' : 'Internship activated' });
  };

  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Moderate Internships</h1>
      <div className="space-y-4">
        {internships.map(i => (
          <div key={i.id} className="card-elevated p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-sm text-muted-foreground">{i.profiles?.organization_name || i.profiles?.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={i.is_active ? 'default' : 'secondary'}>{i.is_active ? 'Active' : 'Inactive'}</Badge>
              <Button variant="outline" size="sm" onClick={() => toggleActive(i.id, i.is_active)}>{i.is_active ? 'Deactivate' : 'Activate'}</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(i.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
