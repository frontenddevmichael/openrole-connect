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
    <header className="sticky top-0 z-50 w-full flex justify-center py-2 px-4 bg-transparent">
      <div
        className={`${scrolled
          ? 'w-full max-w-7xl shadow-lg'
          : 'w-full max-w-5xl shadow-md'
          } transition-all duration-300 ease-in-out bg-background border-2 border-border`}
      >
        <div className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-primary border-2 border-border flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              OpenRole
            </span>
          </Link>

          {/* Navigation and Auth Section */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            {profile?.role === 'organization' && (
              <nav className="hidden md:flex items-center">
                <Link
                  to="/organization-dashboard/post"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hover:bg-secondary"
                >
                  Post Internship
                </Link>
              </nav>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {user || isAdmin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 p-0 hover:bg-secondary">
                      <div className="w-9 h-9 bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/20 border-2 border-transparent hover:border-border">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-2 border-border shadow-lg">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium truncate">
                        {isAdmin ? 'Admin' : profile?.full_name || profile?.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
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
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="font-medium border-2 border-border shadow-sm hover:shadow-md hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}