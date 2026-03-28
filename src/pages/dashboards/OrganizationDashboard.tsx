import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { StatPattern } from '@/components/svg/DashboardVisuals';

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
          <h1 className="font-display text-2xl font-bold mb-1">
            Welcome, {profile?.organization_name || profile?.username}
          </h1>
          <p className="text-muted-foreground text-sm">Manage your internship listings</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="relative overflow-hidden bg-card rounded-xl border border-border/60 p-6 hover:shadow-elevated transition-all duration-300">
            <StatPattern className="absolute -top-4 -right-4 w-32 h-24 text-foreground" variant="blue" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <span className="text-3xl font-display font-bold block">{stats.internships}</span>
              <p className="text-sm text-muted-foreground mt-1">Active Listings</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-card rounded-xl border border-border/60 p-6 hover:shadow-elevated transition-all duration-300">
            <StatPattern className="absolute -top-4 -right-4 w-32 h-24 text-foreground" variant="green" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-success/8 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-success" />
              </div>
              <span className="text-3xl font-display font-bold block">{stats.applicants}</span>
              <p className="text-sm text-muted-foreground mt-1">Total Applicants</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/60 p-6 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <PlusCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <Link to="/organization-dashboard/post">
              <Button className="w-full rounded-lg gap-2">
                Post New Internship <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
