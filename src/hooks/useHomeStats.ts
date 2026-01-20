import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HomeStats {
  activeInternships: number;
  registeredStudents: number;
  registeredOrganizations: number;
  isLoading: boolean;
}

interface FeaturedInternship {
  id: string;
  title: string;
  organization_name: string;
  field: string;
  location: string | null;
  work_type: 'remote' | 'onsite' | 'hybrid';
  is_paid: boolean;
}

interface RegisteredOrganization {
  id: string;
  organization_name: string;
}

export function useHomeStats() {
  const [stats, setStats] = useState<HomeStats>({
    activeInternships: 0,
    registeredStudents: 0,
    registeredOrganizations: 0,
    isLoading: true,
  });

  const [featuredInternships, setFeaturedInternships] = useState<FeaturedInternship[]>([]);
  const [organizations, setOrganizations] = useState<RegisteredOrganization[]>([]);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Fetch counts in parallel
        const [internshipsResult, studentsResult, orgsResult, featuredResult, orgNamesResult] = await Promise.all([
          // Count active internships
          supabase.from('internships').select('id', { count: 'exact', head: true }).eq('is_active', true),
          // Count students
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
          // Count organizations
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'organization'),
          // Get 3 featured internships (most recent active ones)
          supabase
            .from('internships')
            .select('id, title, field, location, work_type, is_paid, profiles!internships_organization_id_fkey(organization_name)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(3),
          // Get organization names for "Trusted by" section
          supabase
            .from('profiles')
            .select('id, organization_name')
            .eq('role', 'organization')
            .not('organization_name', 'is', null)
            .order('created_at', { ascending: true })
            .limit(6),
        ]);

        setStats({
          activeInternships: internshipsResult.count || 0,
          registeredStudents: studentsResult.count || 0,
          registeredOrganizations: orgsResult.count || 0,
          isLoading: false,
        });

        // Transform featured internships
        if (featuredResult.data) {
          const transformed = featuredResult.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            organization_name: item.profiles?.organization_name || 'Unknown Organization',
            field: item.field,
            location: item.location,
            work_type: item.work_type,
            is_paid: item.is_paid || false,
          }));
          setFeaturedInternships(transformed);
        }

        // Set organizations
        if (orgNamesResult.data) {
          setOrganizations(
            orgNamesResult.data
              .filter((org: any) => org.organization_name)
              .map((org: any) => ({
                id: org.id,
                organization_name: org.organization_name,
              }))
          );
        }
      } catch (error) {
        console.error('Error fetching home stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchHomeData();
  }, []);

  return { stats, featuredInternships, organizations };
}
