import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, DocumentIcon, ArrowForwardIcon } from '@/components/icons';

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
      <div className="space-y-10">
        <div>
          <h1 className="font-serif text-2xl text-foreground mb-1">
            Welcome back, {profile?.full_name || profile?.username}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">Your internship overview.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-elevated p-6">
            <BookmarkIcon size={18} className="text-muted-foreground mb-4" />
            <span className="font-serif text-2xl text-foreground block">{stats.saved}</span>
            <p className="text-xs text-muted-foreground font-sans mt-1">Saved roles</p>
          </div>

          <div className="card-elevated p-6">
            <DocumentIcon size={18} className="text-muted-foreground mb-4" />
            <span className="font-serif text-2xl text-foreground block">{stats.applied}</span>
            <p className="text-xs text-muted-foreground font-sans mt-1">Applications</p>
          </div>

          <div className="card-elevated p-6 flex flex-col justify-between">
            <p className="text-xs text-muted-foreground font-sans mb-4">Explore new opportunities</p>
            <Link to="/internships">
              <Button variant="outline" className="w-full font-sans text-sm rounded-md gap-2 border-border">
                Browse roles <ArrowForwardIcon size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
