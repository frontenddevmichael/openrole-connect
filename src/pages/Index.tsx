import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHomeStats } from '@/hooks/useHomeStats';
import { HeroPattern, FloatingShapes, StepConnector } from '@/components/svg/HeroPattern';
import { SectionDivider } from '@/components/svg/DashboardVisuals';

import {
  ArrowRight,
  Briefcase,
  Shield,
  Target,
  Send,
  UserCheck,
  Bell,
  TrendingUp,
  Building2,
  MapPin,
  DollarSign,
  Users
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const features = [
  { icon: <Briefcase className="w-5 h-5" />, title: 'Curated Opportunities', description: 'Quality internships from verified organizations across every industry.' },
  { icon: <Send className="w-5 h-5" />, title: 'Direct Applications', description: 'Apply directly and track your application status in real-time.' },
  { icon: <Shield className="w-5 h-5" />, title: 'Verified Organizations', description: 'Every organization is reviewed to ensure legitimate opportunities.' },
  { icon: <Target className="w-5 h-5" />, title: 'Smart Matching', description: 'Find internships that align with your skills and career goals.' }
];

const howItWorksSteps = [
  { icon: <UserCheck className="w-6 h-6" />, title: 'Create Profile', description: 'Sign up and share your skills, interests, and goals.', step: '01' },
  { icon: <Briefcase className="w-6 h-6" />, title: 'Browse & Apply', description: 'Explore matched opportunities and apply with one click.', step: '02' },
  { icon: <Bell className="w-6 h-6" />, title: 'Track Progress', description: 'Monitor application status and hear back from employers.', step: '03' },
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Get Hired', description: 'Land your dream internship and launch your career.', step: '04' }
];

function useScrollAnimation() {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

export default function Index() {
  const { stats, featuredInternships, organizations } = useHomeStats();
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation();
  const [featuredRef, featuredVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [orgCtaRef, orgCtaVisible] = useScrollAnimation();
  const [finalCtaRef, finalCtaVisible] = useScrollAnimation();

  const workTypeLabels: Record<string, string> = {
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid',
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ───────── HERO ───────── */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background pattern */}
        <HeroPattern className="absolute inset-0 w-full h-full text-foreground pointer-events-none" />

        <div className="page-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">
                {stats.isLoading ? '...' : `${stats.activeInternships} active opportunities`}
              </span>
            </div>

            <h1 className="text-display text-foreground mb-6 animate-slide-up">
              Find internships that{' '}
              <span className="text-primary">launch careers</span>
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-slide-up"
              style={{ animationDelay: '80ms' }}
            >
              Connect with verified organizations offering real-world experience. 
              Build skills, grow your network, start your journey.
            </p>

            <div
              className="flex flex-wrap items-center gap-4 animate-slide-up"
              style={{ animationDelay: '160ms' }}
            >
              <Link to="/internships">
                <Button size="lg" className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                  Browse Internships
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="rounded-xl">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Trusted By */}
            {organizations.length > 0 && (
              <div className="mt-16 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <p className="section-label mb-4">Organizations on OpenRole</p>
                <div className="flex flex-wrap items-center gap-6">
                  {organizations.slice(0, 5).map((org) => (
                    <span
                      key={org.id}
                      className="text-sm font-medium text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {org.organization_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mt-20">
            {[
              { value: stats.activeInternships, label: 'Internships' },
              { value: stats.registeredStudents, label: 'Students' },
              { value: stats.registeredOrganizations, label: 'Organizations' },
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${400 + i * 80}ms` }}>
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.isLoading ? '—' : stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-24 bg-secondary/50" ref={howItWorksRef}>
        <div className="page-container">
          <div className={`mb-14 transition-all duration-600 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label mb-3">How It Works</p>
            <h2 className="text-heading text-foreground max-w-md">
              Four steps to your dream internship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-600 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="bg-card rounded-xl border border-border/60 p-7 h-full hover:shadow-elevated hover:border-primary/20 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {step.icon}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/50 font-medium">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Connector (desktop) */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <StepConnector className="w-6 h-4 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED INTERNSHIPS ───────── */}
      {featuredInternships.length > 0 && (
        <section className="py-24" ref={featuredRef}>
          <div className="page-container">
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 transition-all duration-600 ${featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div>
                <p className="section-label mb-3">Featured</p>
                <h2 className="text-heading text-foreground">Latest opportunities</h2>
              </div>
              <Link to="/internships">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredInternships.map((internship, index) => (
                <Link
                  to={`/internships/${internship.id}`}
                  key={internship.id}
                  className={`group bg-card rounded-xl border border-border/60 p-6 transition-all duration-500 hover:shadow-elevated hover:border-primary/20 hover:-translate-y-1 ${
                    featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${150 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {internship.organization_name}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                    {internship.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                    {internship.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {internship.location}
                      </span>
                    )}
                    {internship.is_paid && (
                      <span className="flex items-center gap-1 text-success">
                        <DollarSign className="w-3.5 h-3.5" />
                        Paid
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs rounded-full">{internship.field}</Badge>
                    <Badge variant="outline" className="text-xs rounded-full">{workTypeLabels[internship.work_type]}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── FEATURES ───────── */}
      <section className="py-24 bg-secondary/50 relative overflow-hidden" ref={featuresRef}>
        <FloatingShapes className="absolute inset-0 w-full h-full text-foreground pointer-events-none" />
        <div className="page-container relative z-10">
          <div className={`mb-14 transition-all duration-600 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label mb-3">Why OpenRole</p>
            <h2 className="text-heading text-foreground max-w-md">
              Built for students, trusted by organizations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl border border-border/60 p-7 transition-all duration-600 hover:shadow-elevated hover:border-primary/20 group ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ORG CTA ───────── */}
      <section className="py-24" ref={orgCtaRef}>
        <div className="page-container">
          <div
            className={`relative bg-foreground rounded-2xl p-12 lg:p-16 overflow-hidden transition-all duration-700 ${
              orgCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Subtle grid pattern on dark bg */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-6">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">
                Are you an organization?
              </h2>
              <p className="text-background/60 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                Find talented students ready to contribute. Post internships and connect with the next generation.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-10 max-w-md mx-auto">
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, label: 'Top Talent' },
                  { icon: <Send className="w-5 h-5" />, label: 'Easy Posting' },
                  { icon: <Users className="w-5 h-5" />, label: 'Direct Connect' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-xs text-background/50 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup?role=organization">
                <Button size="lg" className="rounded-xl gap-2 shadow-glow">
                  Post an Internship <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="py-24 bg-primary relative overflow-hidden" ref={finalCtaRef}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="page-container relative z-10">
          <div className={`text-center transition-all duration-700 ${finalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 text-lg">
              Join students who have found their perfect internship through OpenRole.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 rounded-xl gap-2 shadow-sm"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/internships">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
