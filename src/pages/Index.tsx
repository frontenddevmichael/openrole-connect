import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useHomeStats } from '@/hooks/useHomeStats';
import { CompassIcon, VennIcon, BranchIcon, ArrowForwardIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setVisible(true);},
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealChildren({ children, className }: {children: React.ReactNode;className?: string;}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ?
      children.map((child, i) =>
      <div
        key={i}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 70}ms, transform 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 70}ms`
        }}>
        
              {child}
            </div>
      ) :
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}>{children}</div>
      }
    </div>);

}

export default function Index() {
  const { stats, featuredInternships, organizations } = useHomeStats();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative page-container pt-20 pb-32 md:pt-32 md:pb-40">
        {/* Vertical rule motif */}
        <div
          className="absolute left-20 top-0 bottom-0 w-px hidden md:block bg-black/0"
          style={{ backgroundColor: 'rgba(26, 24, 20, 0.12)' }} />
        

        <div className="max-w-2xl relative">
          <p className="section-eyebrow mb-6">Career Discovery</p>
          <h1
            className="font-serif text-4xl md:text-6xl leading-[1.08] tracking-tight text-foreground"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 500ms ease',
              fontWeight: 400,
              letterSpacing: '-0.02em'
            }}>
            
            Not every career path<br />
            starts with certainty.
          </h1>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed max-w-md font-sans">
            OpenRole connects curious people with real internships at real organizations. 
            No algorithms deciding your future — just clear options, honestly presented.
          </p>
          <div className="flex items-center gap-4 mt-10">
            <Link to="/internships">
              <Button className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92 px-6 h-11 gap-2">
                Explore roles <ArrowForwardIcon size={16} />
              </Button>
            </Link>
            <Link to="/signup" className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
              or create an account
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 01 HOW IT WORKS ─── */}
      <section className="page-container py-20 md:py-32">
        <RevealChildren className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <span className="section-number">01</span>
            <CompassIcon size={32} className="text-foreground mt-4 mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">Explore openly</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Browse internships across fields without creating an account. See what's out there before you commit to anything.
            </p>
          </div>
          <div>
            <span className="section-number">02</span>
            <VennIcon size={32} className="text-foreground mt-4 mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">Find the overlap</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Filter by what you care about — field, location, work style. The right role is the one where your interests and their needs meet.
            </p>
          </div>
          <div>
            <span className="section-number">03</span>
            <BranchIcon size={32} className="text-foreground mt-4 mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">Step forward</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Apply with a single click. Your profile goes to the organization. No cover letter unless you want one.
            </p>
          </div>
        </RevealChildren>
      </section>

      {/* ─── FEATURED ROLES ─── */}
      {featuredInternships.length > 0 &&
      <section className="page-container py-20 md:py-32 border-t border-border">
          <RevealChildren>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-number block mb-2">04</span>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">Worth looking at</h2>
              </div>
              <Link to="/internships" className="text-sm font-sans text-primary hover:underline">
                View all
              </Link>
            </div>
          </RevealChildren>

          <RevealChildren className="grid md:grid-cols-3 gap-6">
            {featuredInternships.map((internship) =>
          <Link
            key={internship.id}
            to={`/internships/${internship.id}`}
            className="card-interactive p-6 flex flex-col justify-between"
            style={{ aspectRatio: '4/3' }}>
            
                <div>
                  <p className="section-eyebrow mb-3">{internship.organization_name}</p>
                  <h3 className="font-serif text-lg text-foreground mb-2">{internship.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    {internship.field}{internship.location ? ` · ${internship.location}` : ''}{internship.work_type === 'remote' ? ' · Remote' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {internship.is_paid &&
              <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">Paid</span>
              }
                  <span className="text-xs text-muted-foreground font-sans border border-border rounded px-2 py-0.5">
                    {internship.work_type === 'remote' ? 'Remote' : internship.work_type === 'hybrid' ? 'Hybrid' : 'On-site'}
                  </span>
                </div>
              </Link>
          )}
          </RevealChildren>
        </section>
      }

      {/* ─── FOR ORGANIZATIONS ─── */}
      <section className="page-container py-20 md:py-32 border-t border-border">
        <RevealChildren>
          <div className="max-w-lg">
            <span className="section-number block mb-2">05</span>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Looking for interns?
            </h2>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-8">
              Post a role in two minutes. Students find you. No fees, no complexity, no middlemen. 
              Just describe the work and who you're looking for.
            </p>
            <Link to="/signup?role=organization">
              <Button variant="outline" className="font-sans text-sm rounded-md px-6 h-11 gap-2 border-border text-foreground hover:bg-card">
                Post a role <ArrowForwardIcon size={16} />
              </Button>
            </Link>
          </div>
        </RevealChildren>
      </section>

      {/* ─── ORGANIZATIONS ─── */}
      {organizations.length > 0 &&
      <section className="page-container py-16 border-t border-border">
          <p className="section-eyebrow mb-6">Organizations on OpenRole</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {organizations.map((org) =>
          <span key={org.id} className="text-sm text-muted-foreground font-sans">
                {org.organization_name}
              </span>
          )}
          </div>
        </section>
      }

      <Footer />
    </div>);

}