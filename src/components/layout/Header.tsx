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
import { User, LogOut, Settings, Briefcase, BookmarkIcon, Menu, X } from 'lucide-react';

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-sm font-display">O</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">
              OpenRole
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/internships"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            >
              Browse
            </Link>
            {profile?.role === 'organization' && (
              <Link
                to="/organization-dashboard/post"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
              >
                Post Internship
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user || isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/15">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-elevated border-border/60">
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-medium truncate">
                      {isAdmin ? 'Admin' : profile?.full_name || profile?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isAdmin ? 'Administrator' : profile?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())} className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {profile?.role === 'student' && (
                    <DropdownMenuItem onClick={() => navigate('/student-dashboard/saved')} className="cursor-pointer">
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      Saved Internships
                    </DropdownMenuItem>
                  )}
                  {!isAdmin && (
                    <DropdownMenuItem onClick={() => navigate(`${getDashboardPath()}/profile`)} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="font-medium rounded-lg shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <nav className="flex flex-col gap-1">
              <Link
                to="/internships"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
              >
                Browse Internships
              </Link>
              {profile?.role === 'organization' && (
                <Link
                  to="/organization-dashboard/post"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  Post Internship
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
