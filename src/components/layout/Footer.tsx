import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">O</span>
              </div>
              <span className="font-semibold text-lg">OpenRole</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Connecting ambitious students with meaningful internship opportunities. 
              Build your career with the right experience.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-medium mb-4 text-sm">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/internships" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h4 className="font-medium mb-4 text-sm">For Organizations</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Post Internships
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Manage Listings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenRole. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
              Built with care for students everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
