import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PersonIcon, CompassIcon, ArrowForwardIcon } from '@/components/icons';

export default function OrganizationDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [stats, setStats] = useState({ internships: 0, applicants: 0 });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const { count: internships } = await supabase.from('internships').select('id', { count: 'exact' }).eq('organization_id', user.id);
        const { data: internshipIds } = await supabase.from('internships').select('id').eq('organization_id', user.id);
        const ids = internshipIds?.map(i => i.id) || [];
        const { count: applicants } = ids.length ? await supabase.from('applications').select('id', { count: 'exact' }).in('internship_id', ids) : { count: 0 };
        setStats({ internships: internships || 0, applicants: applicants || 0 });
      };
      fetchData();
    }
  }, [user]);

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="font-serif text-2xl text-foreground mb-1">
            Welcome, {profile?.organization_name || profile?.username}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">Your listings at a glance.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-elevated p-6">
            <CompassIcon size={18} className="text-muted-foreground mb-4" />
            <span className="font-serif text-2xl text-foreground block">{stats.internships}</span>
            <p className="text-xs text-muted-foreground font-sans mt-1">Active listings</p>
          </div>

          <div className="card-elevated p-6">
            <PersonIcon size={18} className="text-muted-foreground mb-4" />
            <span className="font-serif text-2xl text-foreground block">{stats.applicants}</span>
            <p className="text-xs text-muted-foreground font-sans mt-1">Total applicants</p>
          </div>

          <div className="card-elevated p-6 flex flex-col justify-between">
            <p className="text-xs text-muted-foreground font-sans mb-4">Add a new role</p>
            <Link to="/organization-dashboard/post">
              <Button className="w-full font-sans text-sm rounded-md gap-2 bg-primary text-primary-foreground hover:opacity-92">
                Post role <ArrowForwardIcon size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
