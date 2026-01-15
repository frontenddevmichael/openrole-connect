import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentApplications() {
  const { user, profile, isLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from('applications').select('*, internships(title, profiles!internships_organization_id_fkey(organization_name))').eq('student_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setApplications(data || []));
    }
  }, [user]);

  if (isLoading) return null;
  if (!user || profile?.role !== 'student') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <EmptyState icon={<FileText className="w-8 h-8 text-muted-foreground" />} title="No applications yet" description="Apply to internships to see them here" />
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="card-elevated p-4 flex items-center justify-between">
              <div>
                <Link to={`/internships/${app.internship_id}`} className="font-medium hover:text-primary">{app.internships.title}</Link>
                <p className="text-sm text-muted-foreground">{app.internships.profiles?.organization_name}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{app.status}</Badge>
                <span className="text-xs text-muted-foreground">{format(new Date(app.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
