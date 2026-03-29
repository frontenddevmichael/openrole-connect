import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-serif text-lg text-foreground">
              OpenRole
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">
              A quieter way to find the work that fits. For students still figuring it out — and organizations looking for fresh perspectives.
            </p>
          </div>

          {/* Students */}
          <div>
            <p className="section-eyebrow mb-4">For Students</p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/internships" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse roles
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizations */}
          <div>
            <p className="section-eyebrow mb-4">For Organizations</p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Post roles
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Manage listings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} OpenRole
          </p>
        </div>
      </div>
    </footer>
  );
}
