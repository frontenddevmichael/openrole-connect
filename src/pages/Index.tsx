import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Users, Shield, Sparkles } from 'lucide-react';
const features = [{
  icon: <Briefcase className="w-6 h-6" />,
  title: 'Curated Opportunities',
  description: 'Quality internships from verified organizations across all industries.'
}, {
  icon: <Users className="w-6 h-6" />,
  title: 'Direct Applications',
  description: 'Apply directly and track your application status in real-time.'
}, {
  icon: <Shield className="w-6 h-6" />,
  title: 'Verified Organizations',
  description: 'Every organization is reviewed to ensure legitimate opportunities.'
}, {
  icon: <Sparkles className="w-6 h-6" />,
  title: 'Smart Matching',
  description: 'Find internships that match your skills and career goals.'
}];
const stats = [{
  value: '500+',
  label: 'Active Internships'
}, {
  value: '1,200+',
  label: 'Students Placed'
}, {
  value: '300+',
  label: 'Organizations'
}];
export default function Index() {
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="page-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-display text-foreground mb-6 animate-slide-up">
              Launch Your Career with the{' '}
              <span className="text-primary">Right Internship</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{
            animationDelay: '100ms'
          }}>
              Connect with top organizations offering meaningful internship experiences. 
              Build your skills, grow your network, and start your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{
            animationDelay: '200ms'
          }}>
              <Link to="/internships">
                <Button size="lg" className="gap-2 min-w-[180px]">
                  Browse Internships
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="min-w-[180px]">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in" style={{
          animationDelay: '300ms'
        }}>
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-sunken">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-heading text-foreground mb-4">
              Why Choose OpenRole
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're building the most student-friendly platform for finding and landing internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <div key={index} style={{
            animationDelay: `${index * 100}ms`
          }} className="card-elevated p-6 group hover:transition-all duration-300 animate-slide-up rounded-none">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-foreground">
        <div className="page-container">
          <div className="card-elevated p-12 lg:p-16 text-center bg-gradient-to-br from-primary/5 to-transparent border-0 border-none border-transparent rounded-none shadow-none bg-primary-foreground">
            <h2 className="text-heading text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of students who have found their perfect internship through OpenRole.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/internships">
                <Button variant="ghost" size="lg">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}