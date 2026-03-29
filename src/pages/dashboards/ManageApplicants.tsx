import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PersonIcon, MailIcon, ExternalIcon, CheckIcon, CloseIcon, ClockIcon } from '@/components/icons';
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
  profiles: { full_name: string | null; username: string; cv_url: string | null; email: string; } | null;
  internships: { title: string; } | null;
}

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  reviewing: { label: 'Reviewing', variant: 'outline' },
  accepted: { label: 'Accepted', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export default function ManageApplicants() {
  const { user, profile, isLoading } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchApplicants();
  }, [user]);

  const fetchApplicants = async () => {
    const { data: internships } = await supabase.from('internships').select('id, title').eq('organization_id', user!.id);
    if (!internships?.length) return;
    const { data } = await supabase.from('applications').select('*, profiles!applications_student_id_fkey(full_name, username, cv_url, email), internships!inner(title)').in('internship_id', internships.map(i => i.id)).order('created_at', { ascending: false });
    setApplicants((data as Applicant[]) || []);
  };

  const updateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdating(applicationId);
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', applicationId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } else {
      setApplicants(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app));
      toast({ description: `Marked as ${newStatus}.` });
    }
    setUpdating(null);
  };

  if (isLoading) return null;
  if (!user || profile?.role !== 'organization') return <Navigate to="/login" />;

  const getStatusInfo = (status: string) => statusConfig[status as ApplicationStatus] || statusConfig.pending;

  return (
    <DashboardLayout>
      <div className="flex items-end justify-between mb-8">
        <h1 className="font-serif text-2xl text-foreground">Applicants</h1>
        {applicants.length > 0 && (
          <p className="text-xs text-muted-foreground font-sans">{applicants.length} total</p>
        )}
      </div>

      {applicants.length === 0 ? (
        <EmptyState icon={<PersonIcon size={32} className="text-muted-foreground" />} title="No applicants yet" description="They'll appear here when students apply." />
      ) : (
        <div className="space-y-3">
          {applicants.map(app => {
            const statusInfo = getStatusInfo(app.status);
            return (
              <div key={app.id} className="card-elevated p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-sans font-medium text-foreground">{app.profiles?.full_name || app.profiles?.username}</p>
                      <Badge variant={statusInfo.variant} className="text-xs font-sans">{statusInfo.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">
                      Applied to: <span className="text-foreground">{app.internships?.title}</span> · {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </p>
                    {app.cover_letter && <p className="text-xs text-muted-foreground font-sans mt-2 line-clamp-2">"{app.cover_letter}"</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {app.profiles?.email && (
                      <a href={`mailto:${app.profiles.email}`}>
                        <Button variant="ghost" size="sm" className="gap-1.5 font-sans text-xs"><MailIcon size={14} /> Email</Button>
                      </a>
                    )}
                    {app.profiles?.cv_url && (
                      <a href={app.profiles.cv_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 font-sans text-xs rounded-md border-border"><ExternalIcon size={14} /> CV</Button>
                      </a>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" disabled={updating === app.id} className="font-sans text-xs rounded-md">
                          {updating === app.id ? 'Updating…' : 'Status'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-sans text-sm">
                        <DropdownMenuItem onClick={() => updateStatus(app.id, 'reviewing')} className="gap-2"><ClockIcon size={14} /> Reviewing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, 'accepted')} className="gap-2"><CheckIcon size={14} /> Accept</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')} className="gap-2 text-destructive"><CloseIcon size={14} /> Reject</DropdownMenuItem>
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
