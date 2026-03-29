import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ProfileSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowBackIcon, PinIcon, ClockIcon, CurrencyIcon, CalendarIcon, BuildingIcon, ExternalIcon, BookmarkIcon, CheckIcon, SpinnerIcon } from '@/components/icons';
import { format } from 'date-fns';

interface InternshipData {
  id: string;
  title: string;
  description: string;
  field: string;
  location: string | null;
  work_type: 'remote' | 'onsite' | 'hybrid';
  duration: string | null;
  is_paid: boolean;
  stipend: string | null;
  requirements: string[] | null;
  application_deadline: string | null;
  created_at: string;
  profiles: {
    id: string;
    organization_name: string | null;
    username: string;
    organization_description: string | null;
    organization_website: string | null;
  };
}

export default function InternshipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('internships').select(`*, profiles!internships_organization_id_fkey ( id, organization_name, username, organization_description, organization_website )`).eq('id', id).single();
      if (error || !data) {
        toast({ title: 'Error', description: 'Internship not found', variant: 'destructive' });
        navigate('/internships');
        return;
      }
      setInternship(data as InternshipData);
      if (user) {
        const { data: savedData } = await supabase.from('saved_internships').select('id').eq('internship_id', id).eq('student_id', user.id).single();
        setIsSaved(!!savedData);
        const { data: applicationData } = await supabase.from('applications').select('id').eq('internship_id', id).eq('student_id', user.id).single();
        setHasApplied(!!applicationData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, user, navigate, toast]);

  const toggleSave = async () => {
    if (!user || !internship) return;
    if (isSaved) {
      await supabase.from('saved_internships').delete().eq('internship_id', internship.id).eq('student_id', user.id);
      setIsSaved(false);
      toast({ description: 'Removed from saved' });
    } else {
      await supabase.from('saved_internships').insert({ internship_id: internship.id, student_id: user.id });
      setIsSaved(true);
      toast({ description: 'Saved' });
    }
  };

  const handleApply = async () => {
    if (!user || !internship) return;
    setIsApplying(true);
    const { error } = await supabase.from('applications').insert({ internship_id: internship.id, student_id: user.id, cover_letter: coverLetter || null });
    if (error) {
      toast({ title: 'Error', description: 'Failed to submit application', variant: 'destructive' });
    } else {
      setHasApplied(true);
      setShowApplyDialog(false);
      toast({ title: 'Application submitted.', description: 'Good luck.' });
    }
    setIsApplying(false);
  };

  const workTypeLabels = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="page-container py-12"><ProfileSkeleton /></main>
      </div>
    );
  }

  if (!internship) return null;
  const isStudent = profile?.role === 'student';
  const deadlinePassed = internship.application_deadline ? new Date(internship.application_deadline) < new Date() : false;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 page-container py-10 md:py-16">
        <Link to="/internships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors font-sans">
          <ArrowBackIcon size={16} />
          Back to roles
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="section-eyebrow mb-2">
                {internship.profiles?.organization_name || internship.profiles?.username}
              </p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-2xl md:text-3xl text-foreground">{internship.title}</h1>
                {isStudent && (
                  <button onClick={toggleSave} className={`p-1 transition-colors ${isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <BookmarkIcon size={20} filled={isSaved} />
                  </button>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3">
              <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">{internship.field}</span>
              <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">{workTypeLabels[internship.work_type]}</span>
              {internship.is_paid && <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">Paid</span>}
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-4 py-6 border-t border-b border-border">
              {internship.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <PinIcon size={16} /> {internship.location}
                </div>
              )}
              {internship.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <ClockIcon size={16} /> {internship.duration}
                </div>
              )}
              {internship.stipend && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <CurrencyIcon size={16} /> {internship.stipend}
                </div>
              )}
              {internship.application_deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                  <CalendarIcon size={16} /> Deadline: {format(new Date(internship.application_deadline), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif text-lg text-foreground mb-3">About this role</h2>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed whitespace-pre-wrap">{internship.description}</p>
            </div>

            {/* Requirements */}
            {internship.requirements && internship.requirements.length > 0 && (
              <div>
                <h2 className="font-serif text-lg text-foreground mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {internship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-sans">
                      <CheckIcon size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-elevated p-6">
              {isStudent ? (
                hasApplied ? (
                  <div className="text-center">
                    <CheckIcon size={32} className="text-success mx-auto mb-3" />
                    <h3 className="font-serif text-lg text-foreground mb-1">Applied</h3>
                    <p className="text-xs text-muted-foreground font-sans">You've submitted your application.</p>
                  </div>
                ) : deadlinePassed ? (
                  <div className="text-center">
                    <p className="text-sm text-destructive font-sans font-medium mb-1">Closed</p>
                    <p className="text-xs text-muted-foreground font-sans">The deadline has passed.</p>
                  </div>
                ) : (
                  <>
                    <Button className="w-full font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92 h-10" onClick={() => setShowApplyDialog(true)}>
                      Apply
                    </Button>
                    <p className="text-xs text-muted-foreground font-sans mt-3 text-center">Your profile and CV will be shared.</p>
                  </>
                )
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-sans mb-3">Sign in as a student to apply.</p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-sans text-sm rounded-md border-border">Sign in</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center">
                  <BuildingIcon size={18} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-foreground">
                    {internship.profiles?.organization_name || internship.profiles?.username}
                  </h3>
                  {internship.profiles?.organization_website && (
                    <a href={internship.profiles.organization_website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-sans inline-flex items-center gap-1">
                      Website <ExternalIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
              {internship.profiles?.organization_description && (
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">{internship.profiles.organization_description}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="rounded-lg border-border bg-background">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Apply for {internship.title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground font-sans">
              Add an optional cover letter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-sans font-medium">Cover letter (optional)</Label>
              <Textarea placeholder="Tell them why you're interested…" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} className="font-sans text-sm rounded-md border-border" />
            </div>
            <p className="text-xs text-muted-foreground font-sans">Your profile and CV will be shared.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)} className="font-sans text-sm rounded-md border-border">Cancel</Button>
            <Button onClick={handleApply} disabled={isApplying} className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92">
              {isApplying ? <><SpinnerIcon size={16} className="mr-2" /> Submitting…</> : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
