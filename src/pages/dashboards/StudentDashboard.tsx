import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Bookmark, FileText, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [stats, setStats] = useState({ saved: 0, applied: 0 });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        const [saved, applied] = await Promise.all([
          supabase.from('saved_internships').select('id', { count: 'exact' }).eq('student_id', user.id),
          supabase.from('applications').select('id', { count: 'exact' }).eq('student_id', user.id),
        ]);
        setStats({ saved: saved.count || 0, applied: applied.count || 0 });
      };
      fetchStats();
    }
  }, [user]);

  if (isLoading) return null;
  if (!user || profile?.role !== 'student') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Welcome back, {profile?.full_name || profile?.username}!</h1>
          <p className="text-muted-foreground">Track your internship journey</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold">{stats.saved}</span>
            </div>
            <p className="text-sm text-muted-foreground">Saved Internships</p>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <span className="text-2xl font-bold">{stats.applied}</span>
            </div>
            <p className="text-sm text-muted-foreground">Applications Sent</p>
          </div>
          <div className="card-elevated p-6 flex flex-col justify-between">
            <Briefcase className="w-5 h-5 text-muted-foreground mb-3" />
            <Link to="/internships">
              <Button variant="outline" className="w-full gap-2">
                Browse Internships <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
