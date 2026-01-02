import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and moderate the platform</p>
        </div>
        <div className="card-elevated p-6">
          <Shield className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Moderate Internships</h3>
          <p className="text-sm text-muted-foreground mb-4">Review and manage all internship listings</p>
          <Link to="/admin-dashboard/moderate"><Button>Go to Moderation</Button></Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
