import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Briefcase, BookmarkIcon } from 'lucide-react';

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin-dashboard';
    if (profile?.role === 'organization') return '/organization-dashboard';
    return '/student-dashboard';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg transition-shadow duration-200 ease-in-out ${
        scrolled ? 'shadow-sm' : 'shadow-none'
      }`}
    >
      <div className="page-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            OpenRole
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {profile?.role === 'organization' && (
            <Link
              to="/organization-dashboard/post"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Post Internship
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user || isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-slide-down">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {isAdmin ? 'Admin' : profile?.full_name || profile?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? 'Administrator' : profile?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {profile?.role === 'student' && (
                  <DropdownMenuItem onClick={() => navigate('/student-dashboard/saved')}>
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Saved Internships
                  </DropdownMenuItem>
                )}
                {!isAdmin && (
                  <DropdownMenuItem onClick={() => navigate(`${getDashboardPath()}/profile`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Startedrrr</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
