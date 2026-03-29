import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ShieldIcon, ArrowForwardIcon } from '@/components/icons';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="font-serif text-2xl text-foreground mb-1">Admin</h1>
          <p className="text-sm text-muted-foreground font-sans">Platform moderation.</p>
        </div>
        <div className="card-elevated p-8">
          <ShieldIcon size={24} className="text-muted-foreground mb-4" />
          <h3 className="font-serif text-lg text-foreground mb-2">Moderate listings</h3>
          <p className="text-sm text-muted-foreground font-sans mb-6">Review and manage all internship listings.</p>
          <Link to="/admin-dashboard/moderate">
            <Button className="font-sans text-sm rounded-md gap-2 bg-primary text-primary-foreground hover:opacity-92">
              Moderation <ArrowForwardIcon size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
