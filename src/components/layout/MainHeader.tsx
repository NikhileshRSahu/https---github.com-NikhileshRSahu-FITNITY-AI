
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Zap, LogIn, UserPlus, LayoutDashboard, User as UserIcon, LogOut as LogOutIcon, ClipboardList, Bot, Apple as NutritionIcon, Camera, ShoppingCart } from 'lucide-react';
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
    setMounted(true); // Indicate component has mounted to safely access localStorage

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check login status on mount
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    }
    
    // Listen for storage changes (e.g., login/logout in another tab)
    const checkStorage = (event: StorageEvent) => {
      if (event.key === 'fitnityUserLoggedIn') {
        setIsLoggedIn(event.newValue === 'true');
      }
    };
    window.addEventListener('storage', checkStorage);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkStorage);
    };
  }, []);

  // This effect specifically listens to router changes to re-check login state
  // Useful if login state might change without a full page reload but with route changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') { 
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      if (loggedInStatus !== isLoggedIn) { // Only update if state is actually different
         setIsLoggedIn(loggedInStatus);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, mounted, router]); // Added router to dependency array


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
    }
    setIsLoggedIn(false); // Update state immediately
    router.push('/'); // Navigate to home
    router.refresh(); // Force refresh to ensure all components re-evaluate state
  };

  const navLinkBaseClasses = "flex items-center justify-center md:justify-start gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))] focus-visible:text-accent focus-visible:drop-shadow-[0_0_6px_hsl(var(--accent))]";
  const navIconClasses = "h-5 w-5 flex-shrink-0 group-hover:text-accent group-focus-visible:text-accent transition-colors duration-300";


  const unauthenticatedNavItems: NavItem[] = [
    { href: '/auth/sign-in', label: 'Login', icon: LogIn },
    { href: '/auth/sign-up', label: 'Get Started', icon: UserPlus, isCTA: true },
  ];
  
  const authenticatedNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workout-plan', label: 'Workout', icon: ClipboardList },
    { href: '/nutrition-plan', label: 'Nutrition', icon: NutritionIcon },
    { href: '/form-analysis', label: 'Form Check', icon: Camera },
    { href: '/ai-coach', label: 'AI Coach', icon: Bot },
    { href: '/shop', label: 'Shop', icon: ShoppingCart }, // New Shop Link
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];


  if (!mounted) { // Show a minimal skeleton or static header before hydration
    return (
       <header className={cn("sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out h-20 dark:shadow-accent/10", isScrolled ? "shadow-xl shadow-accent/10 dark:shadow-accent/20 h-16" : "h-20 dark:shadow-accent/10")}>
         <div className={cn("container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out h-full")}>
            <Link href="/" className="flex items-center gap-2 logo-pulse" prefetch={false}>
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-card-foreground">Fitnity AI</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3">
                {/* Placeholder for nav items or a simple spinner */}
            </div>
         </div>
       </header>
    );
  }

  const itemsToDisplay = isLoggedIn ? authenticatedNavItems : unauthenticatedNavItems;

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
          <nav className="flex items-center gap-1 md:gap-1.5"> {/* Reduced gap for more items */}
            {itemsToDisplay.map(item => (
              item.isCTA ? (
                <Button
                  key={item.href}
                  asChild
                  variant="default"
                  size="sm" // Make CTA slightly more compact if needed
                  className={cn(
                    "ml-2 px-3 md:px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm text-accent-foreground cta-glow-pulse active:scale-95",
                    "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn(navIconClasses, "mr-1 md:mr-1.5", "text-accent-foreground group-hover:text-accent-foreground group-focus-visible:text-accent-foreground")} />
                    <span className="hidden sm:inline">{item.label}</span>
                     <span className="sm:hidden">Sign Up</span>
                  </Link>
                </Button>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10 group")}>
                      <Link href={item.href}>
                        <item.icon className={cn(navIconClasses, item.icon === LogIn ? "text-card-foreground group-hover:text-accent group-focus-visible:text-accent" : "text-card-foreground group-hover:text-accent group-focus-visible:text-accent" )} />
                        <span className="hidden md:inline">{item.label}</span>
                        {item.label === 'AI Coach' && isLoggedIn && <span className="glowing-orb ml-1.5 hidden md:inline-block"></span>}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            ))}
            {isLoggedIn && (
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10 group")}>
                        <LogOutIcon className={cn(navIconClasses, "text-card-foreground group-hover:text-accent group-focus-visible:text-accent")} />
                        <span className="hidden md:inline">Logout</span>
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent className="glassmorphic-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                       Are you sure you want to logout from Fitnity AI?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </nav>
        </div>
      </header>
    </TooltipProvider>
  );
}
