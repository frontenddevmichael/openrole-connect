import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/badge';
import { DocumentIcon } from '@/components/icons';
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
      <h1 className="font-serif text-2xl text-foreground mb-8">Applications</h1>
      {applications.length === 0 ? (
        <EmptyState icon={<DocumentIcon size={24} className="text-muted-foreground" />} title="No applications" description="Apply to roles to see them here." />
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="card-elevated p-4 flex items-center justify-between">
              <div>
                <Link to={`/internships/${app.internship_id}`} className="text-sm font-sans font-medium text-foreground hover:text-primary transition-colors">{app.internships.title}</Link>
                <p className="text-xs text-muted-foreground font-sans">{app.internships.profiles?.organization_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs font-sans">{app.status}</Badge>
                <span className="text-xs text-muted-foreground font-sans">{format(new Date(app.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
