
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, BarChart3, BotMessageSquare, Camera, UserCircle, LayoutDashboard } from 'lucide-react'; 

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full glassmorphic-card shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Zap className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold">Fitnity AI</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-1 md:mr-1.5 h-5 w-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out">
            <Link href="/workout-plan">
              <BarChart3 className="mr-1 md:mr-1.5 h-5 w-5" />
              <span className="hidden md:inline">Workout Plan</span>
            </Link>
          </Button>
           <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out">
            <Link href="/form-analysis">
              <Camera className="mr-1 md:mr-1.5 h-5 w-5" />
              <span className="hidden md:inline">Form Analysis</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out">
            <Link href="/ai-coach">
              <BotMessageSquare className="mr-1 md:mr-1.5 h-5 w-5" />
              <span className="hidden md:inline">AI Coach</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm transition-colors duration-200 ease-in-out">
            <Link href="/profile"> 
              <UserCircle className="mr-1 md:mr-1.5 h-5 w-5" /> 
              <span className="hidden md:inline">Profile</span> 
            </Link>
          </Button>
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground ml-2 px-4 py-2 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-sm">
            <Link href="/#pricing">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

