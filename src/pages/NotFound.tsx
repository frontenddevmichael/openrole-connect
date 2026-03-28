import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Abstract 404 visual */}
        <svg viewBox="0 0 200 120" fill="none" className="w-48 h-28 mx-auto mb-8 text-foreground" aria-hidden="true">
          <rect x="20" y="30" width="50" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="none" />
          <rect x="130" y="30" width="50" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="none" />
          <circle cx="100" cy="60" r="25" stroke="hsl(217, 91%, 60%)" strokeWidth="2" opacity="0.3" fill="none" />
          <line x1="118" y1="78" x2="135" y2="95" stroke="hsl(217, 91%, 60%)" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          <text x="35" y="68" fontFamily="Syne" fontSize="24" fontWeight="700" fill="currentColor" opacity="0.15">4</text>
          <text x="145" y="68" fontFamily="Syne" fontSize="24" fontWeight="700" fill="currentColor" opacity="0.15">4</text>
        </svg>

        <h1 className="font-display text-4xl font-bold mb-3 text-foreground">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
