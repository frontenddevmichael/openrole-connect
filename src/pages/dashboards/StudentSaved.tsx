import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bookmark } from 'lucide-react';

export default function StudentSaved() {
  const { user, profile, isLoading } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from('saved_internships').select('internship_id, internships(*, profiles!internships_organization_id_fkey(organization_name, username))').eq('student_id', user.id).then(({ data }) => setSaved(data || []));
    }
  }, [user]);

  const handleRemove = async (internshipId: string) => {
    await supabase.from('saved_internships').delete().eq('internship_id', internshipId).eq('student_id', user!.id);
    setSaved(prev => prev.filter(s => s.internship_id !== internshipId));
  };

  if (isLoading) return null;
  if (!user || profile?.role !== 'student') return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Saved Internships</h1>
      {saved.length === 0 ? (
        <EmptyState icon={<Bookmark className="w-8 h-8 text-muted-foreground" />} title="No saved internships" description="Browse and save internships you're interested in" />
      ) : (
        <div className="space-y-4">
          {saved.map(s => (
            <InternshipCard key={s.internship_id} id={s.internships.id} title={s.internships.title} organizationName={s.internships.profiles?.organization_name || s.internships.profiles?.username} field={s.internships.field} location={s.internships.location} workType={s.internships.work_type} duration={s.internships.duration} isPaid={s.internships.is_paid} isSaved onToggleSave={() => handleRemove(s.internship_id)} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
