import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { Header } from './Header';
import { 
  LayoutDashboard, 
  User, 
  Bookmark, 
  FileText, 
  PlusCircle, 
  Users,
  Shield
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

  const studentNav: NavItem[] = [
    { label: 'Overview', href: '/student-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Profile', href: '/student-dashboard/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Saved', href: '/student-dashboard/saved', icon: <Bookmark className="w-4 h-4" /> },
    { label: 'Applications', href: '/student-dashboard/applications', icon: <FileText className="w-4 h-4" /> },
  ];

  const orgNav: NavItem[] = [
    { label: 'Overview', href: '/organization-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Profile', href: '/organization-dashboard/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Post Internship', href: '/organization-dashboard/post', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Applicants', href: '/organization-dashboard/applicants', icon: <Users className="w-4 h-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview', href: '/admin-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Moderate', href: '/admin-dashboard/moderate', icon: <Shield className="w-4 h-4" /> },
  ];

  const navItems = isAdmin ? adminNav : profile?.role === 'organization' ? orgNav : studentNav;

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Header />
      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="card-elevated p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-hover-overlay hover:text-foreground'
                    )}
                  >
                    {item.icon}
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
