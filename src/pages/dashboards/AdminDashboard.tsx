import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage and moderate the platform</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-8 hover:shadow-elevated transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">Moderate Internships</h3>
          <p className="text-sm text-muted-foreground mb-5">Review and manage all internship listings</p>
          <Link to="/admin-dashboard/moderate">
            <Button className="rounded-lg gap-2">
              Go to Moderation <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
