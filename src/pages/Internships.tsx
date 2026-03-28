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
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, X, Briefcase } from 'lucide-react';
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
  'Technology',
  'Finance',
  'Marketing',
  'Design',
  'Healthcare',
  'Engineering',
  'Business',
  'Education',
  'Media',
  'Other',
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
      .select(`
        id,
        title,
        field,
        location,
        work_type,
        duration,
        is_paid,
        organization_id,
        profiles!internships_organization_id_fkey (
          organization_name,
          username
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,field.ilike.%${search}%`);
    }

    if (fieldFilter && fieldFilter !== 'all') {
      query = query.eq('field', fieldFilter);
    }

    if (workTypeFilter && workTypeFilter !== 'all') {
      query = query.eq('work_type', workTypeFilter as 'remote' | 'onsite' | 'hybrid');
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load internships',
        variant: 'destructive',
      });
    } else {
      setInternships((data as Internship[]) || []);
    }
    
    setIsLoading(false);
  };

  const fetchSavedIds = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('saved_internships')
      .select('internship_id')
      .eq('student_id', user.id);

    if (data) {
      setSavedIds(new Set(data.map(s => s.internship_id)));
    }
  };

  useEffect(() => {
    fetchInternships();
    fetchSavedIds();
  }, [fieldFilter, workTypeFilter, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
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
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save internships',
      });
      return;
    }

    if (profile?.role !== 'student') {
      toast({
        title: 'Not available',
        description: 'Only students can save internships',
      });
      return;
    }

    const isSaved = savedIds.has(internshipId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_internships')
        .delete()
        .eq('internship_id', internshipId)
        .eq('student_id', user.id);

      if (!error) {
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(internshipId);
          return next;
        });
        toast({ description: 'Removed from saved' });
      }
    } else {
      const { error } = await supabase
        .from('saved_internships')
        .insert({ internship_id: internshipId, student_id: user.id });

      if (!error) {
        setSavedIds(prev => new Set(prev).add(internshipId));
        toast({ description: 'Saved to your list' });
      }
    }
  };

  const hasFilters = search || fieldFilter !== 'all' || workTypeFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-surface-sunken">
      <Header />
      
      <main className="flex-1 page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading mb-2">Browse Internships</h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and goals
          </p>
        </div>

        {/* Filters */}
        <div className="card-elevated p-4 mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or field..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>

            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-[160px]">
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
              <SelectTrigger className="w-[140px]">
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {search}
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {fieldFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Field: {fieldFilter}
                  <button onClick={() => setFieldFilter('all')}><X className="w-3 h-3" /></button>
                </Badge>
              )}
              {workTypeFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {workTypeFilter}
                  <button onClick={() => setWorkTypeFilter('all')}><X className="w-3 h-3" /></button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <InternshipCardSkeleton key={i} />
            ))
          ) : internships.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-8 h-8 text-muted-foreground" />}
              title="No internships found"
              description={hasFilters 
                ? "Try adjusting your filters to see more results" 
                : "Check back soon for new opportunities"
              }
              action={hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
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

        {/* Results count */}
        {!isLoading && internships.length > 0 && (
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Showing {internships.length} internship{internships.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
