
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
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isProtected?: boolean;
  isCTA?: boolean;
}

export default function MainHeader() {
  const { getItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Callback to check login status, memoized to prevent re-creation
  const checkLoginStatus = useCallback(() => {
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    }
  }, []);

  useEffect(() => {
    setMounted(true); // Component is now mounted on the client

    checkLoginStatus(); // Initial check

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fitnityUserLoggedIn') {
        checkLoginStatus();
      }
    };
    const handleLoginStateChange = () => {
      checkLoginStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('loginStateChange', handleLoginStateChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('loginStateChange', handleLoginStateChange);
      }
    };
  }, [pathname, checkLoginStatus]); // Only re-run if pathname or checkLoginStatus (stable ref) changes

  useEffect(() => {
    if (mounted) { // Ensure this runs only on client after mount
      setCartItemCount(getItemCount());
    }
  }, [mounted, getItemCount, pathname]); // getItemCount reference stability is important here

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
      window.dispatchEvent(new Event('loginStateChange'));
    }
    router.push('/');
  };
  
  const navLinkBaseClasses = "relative flex items-center justify-center md:justify-start gap-1 px-1.5 py-1.5 md:px-2 md:py-2 rounded-lg text-sm transition-all duration-300 ease-in-out group border-b-2 border-transparent hover:border-accent focus-visible:border-accent";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_8px_hsl(var(--accent))] focus-visible:text-accent focus-visible:drop-shadow-[0_0_8px_hsl(var(--accent))] hover:bg-transparent focus-visible:bg-accent/10";
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
    { href: '/shop', label: 'Shop', icon: ShoppingCart },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  // Render a minimal header during SSR or before client-side mount
  if (!mounted) { 
    return (
       <header className={cn("sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out h-20", "shadow-xl shadow-accent/5 dark:shadow-accent/10")}>
         <div className={cn("container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out h-full")}>
            <Link href="/" className="flex items-center gap-2 logo-pulse flex-shrink-0" prefetch={false}>
              <Zap className="h-7 w-7 md:h-8 md:w-8 text-accent" />
              <span className="text-xl md:text-2xl font-bold text-card-foreground">Fitnity AI</span>
            </Link>
            <nav className="flex items-center gap-0.5 md:gap-1">
              {/* Placeholder for buttons to maintain layout consistency if needed */}
              <div className="h-9 w-20 bg-muted/20 rounded-md"></div>
              <div className="h-9 w-28 bg-muted/20 rounded-md"></div>
            </nav>
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
          isScrolled ? "shadow-xl shadow-accent/5 dark:shadow-accent/10 h-16" : "h-20 dark:shadow-accent/5"
        )}
      >
        <div
          className={cn(
            "container mx-auto flex items-center justify-between px-2 sm:px-4 md:px-6 transition-all duration-300 ease-in-out h-full"
          )}
        >
          <Link href="/" className="flex items-center gap-2 logo-pulse flex-shrink-0" prefetch={false}>
            <Zap className="h-7 w-7 md:h-8 md:w-8 text-accent" />
            <span className="text-xl md:text-2xl font-bold text-card-foreground">Fitnity AI</span>
          </Link>
          <nav className="flex items-center gap-0.5 md:gap-1">
            {itemsToDisplay.map(item => (
              item.isCTA ? (
                <Button
                  key={item.href}
                  asChild
                  size="sm"
                  className={cn(
                    "ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg shadow-md transition-all duration-300 ease-in-out text-xs sm:text-sm text-accent-foreground active:scale-95 h-auto",
                    "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse"
                  )}
                >
                  <Link href={item.href} className="flex items-center">
                    <item.icon className={cn(navIconClasses, "mr-1 md:mr-1.5 h-4 w-4 sm:h-4.5 sm:w-4.5", "text-accent-foreground group-hover:text-accent-foreground group-focus-visible:text-accent-foreground")} />
                    <span className="hidden sm:inline">{item.label === 'Get Started' ? 'Sign Up' : item.label}</span>
                     <span className="sm:hidden text-xs">{item.label === 'Get Started' ? 'Sign Up' : (item.label === 'Login' ? 'Login' : item.label)}</span>
                  </Link>
                </Button>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground px-1.5 sm:px-2 py-1 sm:py-1.5 hover:border-b-accent h-auto")}>
                      <Link href={item.href} className="flex flex-col items-center md:flex-row">
                        <item.icon className={cn(navIconClasses, "text-card-foreground group-hover:text-accent group-focus-visible:text-accent h-4.5 w-4.5 sm:h-5 sm:w-5" )} />
                        <span className="hidden md:inline text-xs sm:text-sm ml-0 md:ml-1.5">{item.label}</span>
                        {item.label === 'AI Coach' && isLoggedIn && <span className="glowing-orb ml-0.5 md:ml-1.5 hidden md:inline-block"></span>}
                        {item.label === 'Shop' && isLoggedIn && cartItemCount > 0 && (
                          <span className="absolute top-0 right-0 -mt-1 -mr-0.5 md:mt-0 md:mr-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                            {cartItemCount > 9 ? '9+' : cartItemCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border shadow-md md:hidden">
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
                      <Button variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground px-1.5 sm:px-2 py-1 sm:py-1.5 hover:border-b-accent h-auto")}>
                        <LogOutIcon className={cn(navIconClasses, "text-card-foreground group-hover:text-accent group-focus-visible:text-accent h-4.5 w-4.5 sm:h-5 sm:w-5")} />
                        <span className="hidden md:inline text-xs sm:text-sm ml-0 md:ml-1.5">Logout</span>
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

    