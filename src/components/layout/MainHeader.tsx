
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
        <nav className="flex items-center gap-0.5 md:gap-1">
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm md:text-base transition-colors duration-200 ease-in-out">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-0 md:mr-2 h-5 w-5" />
              <span className="hidden md:inline">Dashboard</span>
              <span className="md:hidden">Dash</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm md:text-base transition-colors duration-200 ease-in-out">
            <Link href="/workout-plan">
              <BarChart3 className="mr-0 md:mr-2 h-5 w-5" />
              <span className="hidden md:inline">Workout Plan</span>
              <span className="md:hidden">Plan</span>
            </Link>
          </Button>
           <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm md:text-base transition-colors duration-200 ease-in-out">
            <Link href="/form-analysis">
              <Camera className="mr-0 md:mr-2 h-5 w-5" />
              <span className="hidden md:inline">Form Analysis</span>
              <span className="md:hidden">Form</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm md:text-base transition-colors duration-200 ease-in-out">
            <Link href="/ai-coach">
              <BotMessageSquare className="mr-0 md:mr-2 h-5 w-5" />
              <span className="hidden md:inline">AI Coach</span>
              <span className="md:hidden">Coach</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="hover:bg-accent/20 hover:text-accent px-2 md:px-3 py-2 rounded-lg text-sm md:text-base transition-colors duration-200 ease-in-out">
            <Link href="/profile"> 
              <UserCircle className="mr-0 md:mr-2 h-5 w-5" /> 
              <span className="hidden md:inline">Profile</span> 
              <span className="md:hidden">Profile</span> 
            </Link>
          </Button>
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground ml-2 px-3 md:px-6 py-2 md:py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-sm md:text-base">
            <Link href="/#pricing">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
