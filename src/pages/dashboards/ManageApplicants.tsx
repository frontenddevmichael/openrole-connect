import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink } from 'lucide-react';

export default function ManageApplicants() {
  const { user, profile, isLoading } = useAuth();
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data: internships } = await supabase.from('internships').select('id, title').eq('organization_id', user.id);
        if (!internships?.length) return;
        const { data } = await supabase.from('applications').select('*, profiles!applications_student_id_fkey(full_name, username, cv_url, email), internships!inner(title)').in('internship_id', internships.map(i => i.id));
        setApplicants(data || []);
      };
      fetch();
    }
  }, [user]);

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Applicants</h1>
      {applicants.length === 0 ? (
        <EmptyState icon={<Users className="w-8 h-8 text-muted-foreground" />} title="No applicants yet" description="Applicants will appear here when students apply" />
      ) : (
        <div className="space-y-4">
          {applicants.map(app => (
            <div key={app.id} className="card-elevated p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{app.profiles?.full_name || app.profiles?.username}</p>
                <p className="text-sm text-muted-foreground">Applied to: {app.internships?.title}</p>
              </div>
              {app.profiles?.cv_url && (
                <a href={app.profiles.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="w-4 h-4" />View CV</Button>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
