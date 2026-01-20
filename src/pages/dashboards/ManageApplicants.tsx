import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, ExternalLink, Check, X, Clock, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

interface Applicant {
  id: string;
  status: string;
  created_at: string;
  cover_letter: string | null;
  profiles: {
    full_name: string | null;
    username: string;
    cv_url: string | null;
    email: string;
  } | null;
  internships: {
    title: string;
  } | null;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
  reviewing: { label: 'Reviewing', variant: 'outline', icon: <Clock className="w-3 h-3" /> },
  accepted: { label: 'Accepted', variant: 'default', icon: <Check className="w-3 h-3" /> },
  rejected: { label: 'Rejected', variant: 'destructive', icon: <X className="w-3 h-3" /> },
};

export default function ManageApplicants() {
  const { user, profile, isLoading } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchApplicants();
    }
  }, [user]);

  const fetchApplicants = async () => {
    const { data: internships } = await supabase
      .from('internships')
      .select('id, title')
      .eq('organization_id', user!.id);
    
    if (!internships?.length) return;
    
    const { data } = await supabase
      .from('applications')
      .select('*, profiles!applications_student_id_fkey(full_name, username, cv_url, email), internships!inner(title)')
      .in('internship_id', internships.map(i => i.id))
      .order('created_at', { ascending: false });
    
    setApplicants((data as Applicant[]) || []);
  };

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdating(applicationId);
    
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    } else {
      setApplicants(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast({
        title: 'Status Updated',
        description: `Application marked as ${newStatus}`,
      });
    }
    
    setUpdating(null);
  };

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  const getStatusInfo = (status: string) => {
    return statusConfig[status as ApplicationStatus] || statusConfig.pending;
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Applicants</h1>
        {applicants.length > 0 && (
          <p className="text-sm text-muted-foreground">{applicants.length} total application{applicants.length !== 1 ? 's' : ''}</p>
        )}
      </div>
      
      {applicants.length === 0 ? (
        <EmptyState 
          icon={<Users className="w-8 h-8 text-muted-foreground" />} 
          title="No applicants yet" 
          description="Applicants will appear here when students apply to your internships" 
        />
      ) : (
        <div className="space-y-4">
          {applicants.map(app => {
            const statusInfo = getStatusInfo(app.status);
            const isUpdating = updating === app.id;
            
            return (
              <div key={app.id} className="card-elevated p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-foreground">
                        {app.profiles?.full_name || app.profiles?.username}
                      </p>
                      <Badge variant={statusInfo.variant} className="gap-1 text-xs">
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Applied to: <span className="text-foreground">{app.internships?.title}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied on {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </p>
                    {app.cover_letter && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        "{app.cover_letter}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {app.profiles?.email && (
                      <a href={`mailto:${app.profiles.email}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Email</span>
                        </Button>
                      </a>
                    )}
                    
                    {app.profiles?.cv_url && (
                      <a href={app.profiles.cv_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden sm:inline">View CV</span>
                        </Button>
                      </a>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : 'Update Status'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => updateStatus(app.id, 'reviewing')}
                          className="gap-2"
                        >
                          <Clock className="w-4 h-4" />
                          Mark as Reviewing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateStatus(app.id, 'accepted')}
                          className="gap-2 text-green-600"
                        >
                          <Check className="w-4 h-4" />
                          Accept Application
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateStatus(app.id, 'rejected')}
                          className="gap-2 text-destructive"
                        >
                          <X className="w-4 h-4" />
                          Reject Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
