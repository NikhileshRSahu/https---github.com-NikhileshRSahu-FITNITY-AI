import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react'; // Using Zap as a placeholder logo icon

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full glassmorphic-card shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Zap className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-primary-foreground">Fitnity AI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <Link href="#pricing">Get Started Free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
