import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Header } from './Header';

interface NavItem {
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

  const studentNav: NavItem[] = [
    { label: 'Overview', href: '/student-dashboard' },
    { label: 'Profile', href: '/student-dashboard/profile' },
    { label: 'Saved', href: '/student-dashboard/saved' },
    { label: 'Applications', href: '/student-dashboard/applications' },
  ];

  const orgNav: NavItem[] = [
    { label: 'Overview', href: '/organization-dashboard' },
    { label: 'Profile', href: '/organization-dashboard/profile' },
    { label: 'Post role', href: '/organization-dashboard/post' },
    { label: 'Applicants', href: '/organization-dashboard/applicants' },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview', href: '/admin-dashboard' },
    { label: 'Moderate', href: '/admin-dashboard/moderate' },
  ];

  const navItems = isAdmin ? adminNav : profile?.role === 'organization' ? orgNav : studentNav;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="page-container py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-48 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'block text-sm font-sans py-1.5 transition-colors',
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 align-middle" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
