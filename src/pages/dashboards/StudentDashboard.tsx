import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Bookmark, FileText, ArrowRight } from 'lucide-react';
import { StatPattern } from '@/components/svg/DashboardVisuals';

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
          <h1 className="font-display text-2xl font-bold mb-1">
            Welcome back, {profile?.full_name || profile?.username}
          </h1>
          <p className="text-muted-foreground text-sm">Track your internship journey</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Saved */}
          <div className="relative overflow-hidden bg-card rounded-xl border border-border/60 p-6 hover:shadow-elevated hover:border-primary/20 transition-all duration-300">
            <StatPattern className="absolute -top-4 -right-4 w-32 h-24 text-foreground" variant="blue" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                <Bookmark className="w-5 h-5 text-primary" />
              </div>
              <span className="text-3xl font-display font-bold block">{stats.saved}</span>
              <p className="text-sm text-muted-foreground mt-1">Saved Internships</p>
            </div>
          </div>

          {/* Applied */}
          <div className="relative overflow-hidden bg-card rounded-xl border border-border/60 p-6 hover:shadow-elevated hover:border-primary/20 transition-all duration-300">
            <StatPattern className="absolute -top-4 -right-4 w-32 h-24 text-foreground" variant="green" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-success/8 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <span className="text-3xl font-display font-bold block">{stats.applied}</span>
              <p className="text-sm text-muted-foreground mt-1">Applications Sent</p>
            </div>
          </div>

          {/* Browse CTA */}
          <div className="bg-card rounded-xl border border-border/60 p-6 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
            </div>
            <Link to="/internships">
              <Button variant="outline" className="w-full gap-2 rounded-lg">
                Browse Internships <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
