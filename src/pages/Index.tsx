import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import mock from '../assets/mock.png';

import {
  ArrowRight,
  Briefcase,
  Users,
  Shield,
  Target,
  UserCheck,
  Send,
  Bell,
  TrendingUp,
  Building2,
  Quote
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const features = [
  { icon: <Briefcase className="w-6 h-6" />, title: 'Curated Opportunities', description: 'Quality internships from verified organizations across all industries.' },
  { icon: <Send className="w-6 h-6" />, title: 'Direct Applications', description: 'Apply directly and track your application status in real-time.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Verified Organizations', description: 'Every organization is reviewed to ensure legitimate opportunities.' },
  { icon: <Target className="w-6 h-6" />, title: 'Smart Matching', description: 'Find internships that match your skills and career goals.' }
];

const stats = [
  { value: 500, label: 'Active Internships', suffix: '+' },
  { value: 1200, label: 'Students Placed', suffix: '+' },
  { value: 300, label: 'Organizations', suffix: '+' }
];

const howItWorksSteps = [
  { icon: <UserCheck className="w-8 h-8" />, title: 'Create Your Profile', description: 'Sign up and tell us about your skills, interests, and career goals.', step: '01' },
  { icon: <Briefcase className="w-8 h-8" />, title: 'Browse & Apply', description: 'Explore opportunities matched to your profile and apply with one click.', step: '02' },
  { icon: <Bell className="w-8 h-8" />, title: 'Track Applications', description: 'Monitor your application status and communicate with employers.', step: '03' },
  { icon: <TrendingUp className="w-8 h-8" />, title: 'Get Hired', description: 'Land your dream internship and launch your career journey.', step: '04' }
];

const testimonials = [
  { name: 'Michael Omale', company: 'TechCorp', quote: 'OpenRole made finding my internship so easy. I applied to 5 companies and got 3 interviews within a week!' },
  { name: 'Bola Joseph', company: 'BrandFlow', quote: 'The platform is intuitive and the opportunities are legitimate. I found my perfect internship in just 2 weeks.' },
  { name: 'Ivy agbai', company: 'Creative Studio', quote: 'Love how I can track all my applications in one place. Got my dream internship at a top design agency!' }
];

const trustedCompanies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'];


// Scroll Animation Hook
function useScrollAnimation() {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate once
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px', // 🔥 fixes late trigger
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}


function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Index() {
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [organizationsRef, organizationsVisible] = useScrollAnimation();
  const [finalCtaRef, finalCtaVisible] = useScrollAnimation();


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-secondary">
        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
                Launch Your Career with the{' '}
                <span className="bg-primary text-primary-foreground px-2 inline-block transform -rotate-1">
                  Right Internship
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                Connect with top organizations offering meaningful internship experiences.
                Build your skills, grow your network, and start your professional journey.
              </p>
              <div
                className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-slide-up"
                style={{ animationDelay: '200ms' }}
              >
                <Link to="/internships">
                  <Button size="lg" className="gap-2 min-w-[180px] bg-primary text-primary-foreground border-2 border-border shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all">
                    Browse Internships
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="min-w-[180px] border-2 border-border shadow-sm hover:shadow-md hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Trusted By */}
              <div className="mt-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <p className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Trusted by students at:</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {trustedCompanies.slice(0, 4).map((company, index) => (
                    <div
                      key={index}
                      className="text-foreground font-bold text-sm hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${400 + index * 50}ms` }}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center items-center min-h-[600px]">
              {/* GUARANTEED VISIBLE BLOB - FIXED! */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] lg:w-[800px] lg:h-[800px] opacity-30"
                  style={{ zIndex: 1 }}
                >
                  <path
                    fill="currentColor"
                    className="text-primary"
                    d="M38.6,-52.1C48.6,-37.7,54.1,-24.1,59.3,-8.4C64.5,7.3,69.4,25.1,64.6,41C59.8,56.8,45.3,70.7,28.7,75.3C12,79.9,-6.8,75.2,-25.6,69C-44.3,62.7,-63,54.9,-74.9,40.3C-86.8,25.7,-92,4.3,-87.1,-14C-82.2,-32.2,-67.3,-47.4,-51.1,-60.7C-34.9,-74,-17.5,-85.4,-1.6,-83.6C14.3,-81.7,28.7,-66.5,38.6,-52.1Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              {/* Phone mockup image */}
              <div className="relative animate-fade-in" style={{ animationDelay: '400ms', zIndex: 10 }}>
                <img
                  src={mock}
                  alt="OpenRole App Mockup"
                  className="w-48 sm:w-64 md:w-72 lg:w-80 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>

            </div>
          </div>

          {/* Stats */}
          <div
            id="stats-section"
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20 px-4"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-background border-2 border-border shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-bold text-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background" ref={howItWorksRef}>
        <div className="page-container">
          <div className={`text-center mb-16 transition-all duration-700 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Landing your dream internship is just four simple steps away. Start your journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-700 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-border -translate-x-1/2 z-0" />
                )}
                <div className="relative bg-secondary border-2 border-border p-8 shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200 h-full">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-background border-2 border-border flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-secondary" ref={testimonialsRef}>
        <div className="page-container">
          <div className={`text-center mb-16 transition-all duration-700 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Loved by Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join thousands of students who have successfully landed their dream internships through OpenRole.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-background border-2 border-border p-8 shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-700 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Quote className="w-10 h-10 text-primary mb-4" />
                <p className="text-foreground mb-6 font-medium leading-relaxed">"{testimonial.quote}"</p>
                <div className="pt-4 border-t-2 border-border">
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground font-bold">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background" ref={featuresRef}>
        <div className="page-container">
          <div className={`text-center mb-16 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose OpenRole</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We're building the most student-friendly platform for finding and landing internships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-secondary border-2 border-border p-8 shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-700 group ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 bg-primary border-2 border-border flex items-center justify-center mb-6 text-primary-foreground group-hover:bg-background group-hover:text-primary transition-all duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations CTA */}
      <section className="py-24 bg-secondary relative overflow-hidden" ref={organizationsRef}>
        <div className="page-container relative">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-background border-2 border-border p-12 lg:p-16 shadow-xl text-center transition-all duration-700 ${organizationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary border-2 border-border mb-6 shadow-sm">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Are You an Organization?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                Find talented students ready to contribute to your team. Post internships and connect with the next generation of professionals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: <TrendingUp className="w-8 h-8 text-primary mb-2" />, title: 'Top Talent', desc: 'Pre-vetted students' },
                  { icon: <Send className="w-8 h-8 text-primary mb-2" />, title: 'Easy Posting', desc: 'Quick setup' },
                  { icon: <Users className="w-8 h-8 text-primary mb-2" />, title: 'Direct Connect', desc: 'Streamlined hiring' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-4 bg-secondary border-2 border-border transition-all duration-700 ${organizationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    {item.icon}
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup?role=organization">
                  <Button size="lg" className="gap-2 bg-primary text-primary-foreground border-2 border-border shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all">
                    Post an Internship
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/signup?role=organization">
                  <Button variant="outline" size="lg" className="border-2 border-border shadow-sm hover:shadow-md hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary" ref={finalCtaRef}>
        <div className="page-container">
          <div className={`bg-primary p-12 lg:p-16 text-center transition-all duration-700 ${finalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of students who have found their perfect internship through OpenRole.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2 min-w-[200px] bg-primary-foreground text-primary border-2 border-primary-foreground hover:bg-primary-foreground/90 shadow-md hover:shadow-lg transition-all">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/internships">
                <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-sm hover:shadow-md hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
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