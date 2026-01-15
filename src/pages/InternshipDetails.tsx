import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ProfileSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Building2, ExternalLink, Bookmark, BookmarkCheck, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
interface InternshipDetails {
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
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user,
    profile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [internship, setInternship] = useState<InternshipDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Fetch internship details
      const {
        data,
        error
      } = await supabase.from('internships').select(`
          *,
          profiles!internships_organization_id_fkey (
            id,
            organization_name,
            username,
            organization_description,
            organization_website
          )
        `).eq('id', id).single();
      if (error || !data) {
        toast({
          title: 'Error',
          description: 'Internship not found',
          variant: 'destructive'
        });
        navigate('/internships');
        return;
      }
      setInternship(data as InternshipDetails);

      // Check if saved/applied (for students)
      if (user) {
        const {
          data: savedData
        } = await supabase.from('saved_internships').select('id').eq('internship_id', id).eq('student_id', user.id).single();
        setIsSaved(!!savedData);
        const {
          data: applicationData
        } = await supabase.from('applications').select('id').eq('internship_id', id).eq('student_id', user.id).single();
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
      toast({
        description: 'Removed from saved'
      });
    } else {
      await supabase.from('saved_internships').insert({
        internship_id: internship.id,
        student_id: user.id
      });
      setIsSaved(true);
      toast({
        description: 'Saved to your list'
      });
    }
  };
  const handleApply = async () => {
    if (!user || !internship) return;
    setIsApplying(true);
    const {
      error
    } = await supabase.from('applications').insert({
      internship_id: internship.id,
      student_id: user.id,
      cover_letter: coverLetter || null
    });
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive'
      });
    } else {
      setHasApplied(true);
      setShowApplyDialog(false);
      toast({
        title: 'Application submitted!',
        description: 'Good luck with your application.'
      });
    }
    setIsApplying(false);
  };
  const workTypeLabels = {
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid'
  };
  if (isLoading) {
    return <div className="min-h-screen bg-surface-sunken">
        <Header />
        <main className="page-container py-8">
          <ProfileSkeleton />
        </main>
      </div>;
  }
  if (!internship) return null;
  const isStudent = profile?.role === 'student';
  const deadlinePassed = internship.application_deadline ? new Date(internship.application_deadline) < new Date() : false;
  return <div className="min-h-screen flex flex-col bg-surface-sunken">
      <Header />
      
      <main className="flex-1 page-container py-8">
        {/* Back link */}
        <Link to="/internships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-8 animate-slide-up px-[56px]">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {internship.profiles?.organization_name || internship.profiles?.username}
                  </p>
                  <h1 className="text-2xl font-semibold">{internship.title}</h1>
                </div>
                {isStudent && <Button variant="ghost" size="icon" onClick={toggleSave} className={isSaved ? 'text-primary' : 'text-muted-foreground'}>
                    {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </Button>}
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="secondary">{internship.field}</Badge>
                <Badge variant="outline">{workTypeLabels[internship.work_type]}</Badge>
                {internship.is_paid && <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>}
              </div>

              {/* Details grid */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-surface-sunken rounded-lg mb-8 px-[26px]">
                {internship.location && <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{internship.location}</span>
                  </div>}
                {internship.duration && <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{internship.duration}</span>
                  </div>}
                {internship.stipend && <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{internship.stipend}</span>
                  </div>}
                {internship.application_deadline && <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Deadline: {format(new Date(internship.application_deadline), 'MMM d, yyyy')}
                    </span>
                  </div>}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-semibold mb-3">About this role</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {internship.description}
                </p>
              </div>

              {/* Requirements */}
              {internship.requirements && internship.requirements.length > 0 && <div>
                  <h2 className="font-semibold mb-3">Requirements</h2>
                  <ul className="space-y-2">
                    {internship.requirements.map((req, index) => <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>)}
                  </ul>
                </div>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="card-elevated p-6 animate-slide-up" style={{
            animationDelay: '100ms'
          }}>
              {isStudent ? hasApplied ? <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Application Submitted</h3>
                    <p className="text-sm text-muted-foreground">
                      You've applied for this position
                    </p>
                  </div> : deadlinePassed ? <div className="text-center">
                    <p className="text-destructive font-medium mb-1">Application Closed</p>
                    <p className="text-sm text-muted-foreground">
                      The deadline for this internship has passed
                    </p>
                  </div> : <>
                    <Button className="w-full mb-3" onClick={() => setShowApplyDialog(true)}>
                      Apply Now
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Your profile and CV will be shared with the organization
                    </p>
                  </> : <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign in as a student to apply
                  </p>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                </div>}
            </div>

            {/* Organization Card */}
            <div className="card-elevated p-6 animate-slide-up" style={{
            animationDelay: '150ms'
          }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {internship.profiles?.organization_name || internship.profiles?.username}
                  </h3>
                  {internship.profiles?.organization_website && <a href={internship.profiles.organization_website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Visit website
                      <ExternalLink className="w-3 h-3" />
                    </a>}
                </div>
              </div>
              {internship.profiles?.organization_description && <p className="text-sm text-muted-foreground">
                  {internship.profiles.organization_description}
                </p>}
            </div>
          </div>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {internship.title}</DialogTitle>
            <DialogDescription>
              Add an optional cover letter to your application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea id="coverLetter" placeholder="Tell the organization why you're interested in this role..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={6} />
            </div>
            <p className="text-xs text-muted-foreground">
              Your profile information and CV (if uploaded) will be shared with the organization.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </> : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
}