
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, BarChart3 } from 'lucide-react'; // Using Zap as a placeholder logo icon

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full glassmorphic-card shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Zap className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-primary-foreground">Fitnity AI</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Button asChild variant="ghost" className="text-primary-foreground hover:bg-accent/20 hover:text-accent px-3 py-2 rounded-lg text-sm md:text-base">
            <Link href="/workout-plan">
              <BarChart3 className="mr-0 md:mr-2 h-5 w-5" />
              <span className="hidden md:inline">Workout Planner</span>
              <span className="md:hidden">Plan</span>
            </Link>
          </Button>
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-sm md:text-base">
            <Link href="#pricing">Get Started Free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
