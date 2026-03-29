import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CompassIcon, ArrowForwardIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center page-container py-20">
        <div className="text-center max-w-md">
          <CompassIcon size={48} className="text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-foreground mb-3">Off the map</h1>
          <p className="text-sm text-muted-foreground font-sans mb-8 leading-relaxed">
            This page doesn't exist. It might have been moved, or maybe the URL has a typo.
          </p>
          <Link to="/">
            <Button variant="outline" className="font-sans text-sm rounded-md gap-2 border-border">
              Back to start <ArrowForwardIcon size={16} />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
