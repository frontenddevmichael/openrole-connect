import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { InternshipCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchIcon, CloseIcon, CompassIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

interface Internship {
  id: string;
  title: string;
  field: string;
  location: string | null;
  work_type: 'remote' | 'onsite' | 'hybrid';
  duration: string | null;
  is_paid: boolean;
  organization_id: string;
  profiles: {
    organization_name: string | null;
    username: string;
  };
}

const FIELDS = [
  'Technology', 'Finance', 'Marketing', 'Design', 'Healthcare',
  'Engineering', 'Business', 'Education', 'Media', 'Other',
];

export default function Internships() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [fieldFilter, setFieldFilter] = useState(searchParams.get('field') || 'all');
  const [workTypeFilter, setWorkTypeFilter] = useState(searchParams.get('workType') || 'all');

  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchInternships = async () => {
    setIsLoading(true);
    let query = supabase
      .from('internships')
      .select(`id, title, field, location, work_type, duration, is_paid, organization_id, profiles!internships_organization_id_fkey ( organization_name, username )`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (search) query = query.or(`title.ilike.%${search}%,field.ilike.%${search}%`);
    if (fieldFilter && fieldFilter !== 'all') query = query.eq('field', fieldFilter);
    if (workTypeFilter && workTypeFilter !== 'all') query = query.eq('work_type', workTypeFilter as any);

    const { data, error } = await query;
    if (error) {
      toast({ title: 'Error', description: 'Failed to load internships', variant: 'destructive' });
    } else {
      setInternships((data as Internship[]) || []);
    }
    setIsLoading(false);
  };

  const fetchSavedIds = async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_internships').select('internship_id').eq('student_id', user.id);
    if (data) setSavedIds(new Set(data.map(s => s.internship_id)));
  };

  useEffect(() => {
    fetchInternships();
    fetchSavedIds();
  }, [fieldFilter, workTypeFilter, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    search ? params.set('search', search) : params.delete('search');
    setSearchParams(params);
    fetchInternships();
  };

  const clearFilters = () => {
    setSearch('');
    setFieldFilter('all');
    setWorkTypeFilter('all');
    setSearchParams(new URLSearchParams());
  };

  const toggleSave = async (internshipId: string) => {
    if (!user) { toast({ title: 'Sign in required', description: 'Please sign in to save internships' }); return; }
    if (profile?.role !== 'student') { toast({ title: 'Not available', description: 'Only students can save internships' }); return; }

    const isSaved = savedIds.has(internshipId);
    if (isSaved) {
      const { error } = await supabase.from('saved_internships').delete().eq('internship_id', internshipId).eq('student_id', user.id);
      if (!error) { setSavedIds(prev => { const next = new Set(prev); next.delete(internshipId); return next; }); toast({ description: 'Removed from saved' }); }
    } else {
      const { error } = await supabase.from('saved_internships').insert({ internship_id: internshipId, student_id: user.id });
      if (!error) { setSavedIds(prev => new Set(prev).add(internshipId)); toast({ description: 'Saved' }); }
    }
  };

  const hasFilters = search || fieldFilter !== 'all' || workTypeFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 page-container py-12 md:py-20">
        <div className="mb-10">
          <p className="section-eyebrow mb-3">Browse</p>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Open roles</h1>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <SearchIcon size={16} />
              </div>
              <Input
                placeholder="Search by title or field…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-md h-10 border-border bg-background font-sans text-sm"
              />
            </div>
            <Button type="submit" className="rounded-md h-10 font-sans text-sm bg-primary text-primary-foreground">Search</Button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-[150px] rounded-md h-9 text-sm font-sans border-border">
                <SelectValue placeholder="All fields" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fields</SelectItem>
                {FIELDS.map(field => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
              <SelectTrigger className="w-[130px] rounded-md h-9 text-sm font-sans border-border">
                <SelectValue placeholder="Work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-sans transition-colors"
              >
                <CloseIcon size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <InternshipCardSkeleton key={i} />)
          ) : internships.length === 0 ? (
            <EmptyState
              icon={<CompassIcon size={32} className="text-muted-foreground" />}
              title="No roles found"
              description={hasFilters ? "Try adjusting your filters" : "Check back soon for new opportunities"}
              action={hasFilters ? <Button variant="outline" onClick={clearFilters} className="rounded-md font-sans text-sm">Clear filters</Button> : undefined}
            />
          ) : (
            internships.map(internship => (
              <InternshipCard
                key={internship.id}
                id={internship.id}
                title={internship.title}
                organizationName={internship.profiles?.organization_name || internship.profiles?.username || 'Unknown'}
                field={internship.field}
                location={internship.location}
                workType={internship.work_type}
                duration={internship.duration}
                isPaid={internship.is_paid}
                isSaved={savedIds.has(internship.id)}
                onToggleSave={() => toggleSave(internship.id)}
                showSaveButton={profile?.role === 'student'}
              />
            ))
          )}
        </div>

        {!isLoading && internships.length > 0 && (
          <p className="text-xs text-muted-foreground mt-10 text-center font-sans">
            {internships.length} role{internships.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
