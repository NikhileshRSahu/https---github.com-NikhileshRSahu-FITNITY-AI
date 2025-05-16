
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, LogIn, UserPlus, LayoutDashboard, User, LogOut as LogOutIcon, ClipboardList, Bot, Apple as NutritionIcon, Camera, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isProtected?: boolean;
  isCTA?: boolean;
}

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const loggedInStatus = typeof window !== 'undefined' && localStorage.getItem('fitnityUserLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    
    const checkStorage = () => {
      if (typeof window !== 'undefined') {
        const currentLoggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
        if (currentLoggedInStatus !== isLoggedIn) {
          setIsLoggedIn(currentLoggedInStatus);
        }
      }
    };
    window.addEventListener('storage', checkStorage);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkStorage);
    };
  }, [isLoggedIn]);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
    }
    setIsLoggedIn(false);
    router.push('/');
    router.refresh(); 
  };

  const navLinkBaseClasses = "flex items-center justify-center md:justify-start gap-1 md:gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))]";
  const navIconClasses = "h-5 w-5 flex-shrink-0";

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, isProtected: true },
    { href: '/workout-plan', label: 'Workout', icon: ClipboardList, isProtected: true },
    { href: '/nutrition-plan', label: 'Nutrition', icon: NutritionIcon, isProtected: true },
    { href: '/form-analysis', label: 'Form Check', icon: Camera, isProtected: true },
    { href: '/ai-coach', label: 'AI Coach', icon: Bot, isProtected: true },
    { href: '/profile', label: 'Profile', icon: User, isProtected: true },
    { href: '/auth/sign-in', label: 'Login', icon: LogIn, isProtected: false },
    { href: '/auth/sign-up', label: 'Get Started', icon: UserPlus, isProtected: false, isCTA: true },
  ];

  if (!mounted) {
    // To prevent hydration mismatch, render a placeholder or simplified header until client-side state is available
    return (
       <header className={cn("sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out h-20 dark:shadow-accent/10")}>
         <div className={cn("container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out h-full")}>
            <Link href="/" className="flex items-center gap-2 logo-pulse" prefetch={false}>
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-card-foreground">Fitnity AI</span>
            </Link>
            <div className="flex items-center gap-1 md:gap-2">
                {/* Skeleton for nav items */}
            </div>
         </div>
       </header>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
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
                {navItems.filter(item => item.isProtected).map(item => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                        <Link href={item.href}>
                          <item.icon className={cn(navIconClasses, "group-hover:text-accent")} />
                          <span className="hidden md:inline">{item.label}</span>
                          {item.label === 'AI Coach' && <span className="glowing-orb ml-1.5 hidden md:inline-block"></span>}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={handleLogout} className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                      <LogOutIcon className={cn(navIconClasses, "group-hover:text-accent")} />
                      <span className="hidden md:inline">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                {navItems.filter(item => !item.isProtected && !item.isCTA).map(item => (
                   <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
                        <Link href={item.href}>
                          <item.icon className={cn(navIconClasses, "group-hover:text-accent")} />
                          <span className="hidden md:inline">{item.label}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {navItems.filter(item => item.isCTA).map(item => (
                  <Button
                    key={item.href}
                    asChild
                    variant="default"
                    className={cn(
                      "ml-2 px-3 md:px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm text-accent-foreground",
                      "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse active:scale-95"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn(navIconClasses, "mr-1 md:mr-1.5")} />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">Sign Up</span>
                    </Link>
                  </Button>
                ))}
              </>
            )}
          </nav>
        </div>
      </header>
    </TooltipProvider>
  );
}
