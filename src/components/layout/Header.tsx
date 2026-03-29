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
import { PersonIcon, LogOutIcon, SettingsIcon, CompassIcon, BookmarkIcon, MenuIcon, CloseIcon } from '@/components/icons';

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
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-serif text-lg tracking-tight text-foreground">
            OpenRole
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/internships"
              className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse
            </Link>
            {profile?.role === 'organization' && (
              <Link
                to="/organization-dashboard/post"
                className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
              >
                Post
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user || isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <PersonIcon size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-lg border border-border bg-background">
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-sans font-medium truncate text-foreground">
                      {isAdmin ? 'Admin' : profile?.full_name || profile?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isAdmin ? 'Administrator' : profile?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())} className="cursor-pointer text-sm font-sans">
                    <CompassIcon size={16} className="mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {profile?.role === 'student' && (
                    <DropdownMenuItem onClick={() => navigate('/student-dashboard/saved')} className="cursor-pointer text-sm font-sans">
                      <BookmarkIcon size={16} className="mr-2" />
                      Saved
                    </DropdownMenuItem>
                  )}
                  {!isAdmin && (
                    <DropdownMenuItem onClick={() => navigate(`${getDashboardPath()}/profile`)} className="cursor-pointer text-sm font-sans">
                      <SettingsIcon size={16} className="mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer text-sm font-sans"
                  >
                    <LogOutIcon size={16} className="mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-sans text-sm text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="font-sans text-sm rounded-md bg-primary text-primary-foreground hover:opacity-92">
                    Join
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2">
            <nav className="flex flex-col gap-1">
              <Link
                to="/internships"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-sans text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Browse
              </Link>
              {profile?.role === 'organization' && (
                <Link
                  to="/organization-dashboard/post"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-sans text-muted-foreground hover:text-foreground py-2 transition-colors"
                >
                  Post
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
