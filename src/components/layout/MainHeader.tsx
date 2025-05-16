
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, LogIn, UserPlus, LayoutDashboard, User, LogOut as LogOutIcon, ClipboardList, Bot, Apple as NutritionIcon, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Check login state from localStorage on mount
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-check localStorage if it changes (e.g. after login/logout on another page or tab)
  useEffect(() => {
    const checkStorage = () => {
      if (typeof window !== 'undefined') {
        const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
        if (loggedInStatus !== isLoggedIn) {
          setIsLoggedIn(loggedInStatus);
        }
      }
    };
    window.addEventListener('storage', checkStorage); // Listen for storage changes in other tabs
    checkStorage(); // Initial check in case it changed while component was unmounted
    return () => window.removeEventListener('storage', checkStorage);
  }, [isLoggedIn]);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
    }
    setIsLoggedIn(false);
    router.push('/');
    router.refresh(); // Ensure header re-renders immediately across the app
  };

  const navLinkBaseClasses = "flex items-center justify-center md:justify-start gap-1 md:gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))]";
  const navIconClasses = "h-5 w-5 flex-shrink-0";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out",
        isScrolled ? "shadow-xl shadow-accent/10 dark:shadow-accent/20 h-16" : "h-20 dark:shadow-accent/10"
      )}
    >
      <div
        className={cn(
          "container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out h-full"
        )}
      >
        <Link href="/" className="flex items-center gap-2 logo-pulse" prefetch={false}>
          <Zap className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-card-foreground">Fitnity AI</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/dashboard">
                  <LayoutDashboard className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/workout-plan">
                  <ClipboardList className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Workout</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/nutrition-plan">
                  <NutritionIcon className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Nutrition</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/form-analysis">
                  <Camera className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Form Check</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/ai-coach">
                  <Bot className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">AI Coach</span>
                  <span className="glowing-orb ml-1.5 hidden md:inline-block"></span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/profile">
                  <User className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Profile</span>
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout} className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <LogOutIcon className={cn(navIconClasses, "group-hover:text-accent")} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                <Link href="/auth/sign-in">
                  <LogIn className={cn(navIconClasses, "group-hover:text-accent")} />
                  <span className="hidden md:inline">Login</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className={cn(
                  "ml-2 px-3 md:px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm text-accent-foreground",
                  "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse active:scale-95"
                )}
              >
                <Link href="/auth/sign-up">
                  <UserPlus className={cn(navIconClasses, "mr-1 md:mr-1.5")} />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
