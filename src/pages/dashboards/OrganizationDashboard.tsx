import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, PlusCircle } from 'lucide-react';

export default function OrganizationDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [stats, setStats] = useState({ internships: 0, applicants: 0 });

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { count: internships } = await supabase.from('internships').select('id', { count: 'exact' }).eq('organization_id', user.id);
        const { data: internshipIds } = await supabase.from('internships').select('id').eq('organization_id', user.id);
        const ids = internshipIds?.map(i => i.id) || [];
        const { count: applicants } = ids.length ? await supabase.from('applications').select('id', { count: 'exact' }).in('internship_id', ids) : { count: 0 };
        setStats({ internships: internships || 0, applicants: applicants || 0 });
      };
      fetch();
    }
  }, [user]);

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Welcome, {profile?.organization_name || profile?.username}!</h1>
          <p className="text-muted-foreground">Manage your internship listings</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-elevated p-6">
            <Briefcase className="w-5 h-5 text-primary mb-3" />
            <span className="text-2xl font-bold">{stats.internships}</span>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </div>
          <div className="card-elevated p-6">
            <Users className="w-5 h-5 text-success mb-3" />
            <span className="text-2xl font-bold">{stats.applicants}</span>
            <p className="text-sm text-muted-foreground">Total Applicants</p>
          </div>
          <div className="card-elevated p-6 flex flex-col justify-between">
            <PlusCircle className="w-5 h-5 text-muted-foreground mb-3" />
            <Link to="/organization-dashboard/post">
              <Button className="w-full">Post New Internship</Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
