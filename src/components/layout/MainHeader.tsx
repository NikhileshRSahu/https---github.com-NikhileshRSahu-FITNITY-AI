
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
import { Zap, LogIn, UserPlus, LayoutDashboard, User as UserIcon, LogOut as LogOutIcon, ClipboardList, Bot, Apple as NutritionIcon, Camera, ShoppingCart, Settings as SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext'; // Import useCart

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
  const pathname = usePathname();
  const { getItemCount } = useCart(); // Get cart item count
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    };
    checkLoginStatus(); // Initial check

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fitnityUserLoggedIn') {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      setCartItemCount(getItemCount());
    }
  }, [mounted, getItemCount, pathname]); // Re-check cart count on pathname change too

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
    }
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  const navLinkBaseClasses = "relative flex items-center justify-center md:justify-start gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out group";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))] focus-visible:text-accent focus-visible:drop-shadow-[0_0_6px_hsl(var(--accent))] hover:bg-transparent focus-visible:bg-accent/10";
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

  if (!mounted) {
    return (
       <header className={cn("sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out h-20 dark:shadow-accent/10", isScrolled ? "shadow-xl shadow-accent/10 dark:shadow-accent/20 h-16" : "h-20 dark:shadow-accent/10")}>
         <div className={cn("container mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ease-in-out h-full")}>
            <Link href="/" className="flex items-center gap-2 logo-pulse" prefetch={false}>
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-card-foreground">Fitnity AI</span>
            </Link>
            <div className="flex items-center gap-0.5 md:gap-1">
              {/* Skeleton for nav items or a simple spinner */}
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
          <nav className="flex items-center gap-0 md:gap-0.5">
            {itemsToDisplay.map(item => (
              item.isCTA ? (
                <Button
                  key={item.href}
                  asChild
                  variant="default"
                  size="sm"
                  className={cn(
                    "ml-1 md:ml-2 px-3 md:px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm text-accent-foreground cta-glow-pulse active:scale-95",
                    "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn(navIconClasses, "mr-1 md:mr-1.5", "text-accent-foreground group-hover:text-accent-foreground group-focus-visible:text-accent-foreground")} />
                    <span className="hidden sm:inline">{item.label === 'Get Started' ? 'Sign Up' : item.label}</span>
                    <span className="sm:hidden">{item.label === 'Get Started' ? 'Sign Up' : item.label}</span>
                  </Link>
                </Button>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground")}>
                      <Link href={item.href}>
                        <item.icon className={cn(navIconClasses, "text-card-foreground group-hover:text-accent group-focus-visible:text-accent" )} />
                        <span className="hidden md:inline text-sm">{item.label}</span>
                        {item.label === 'AI Coach' && isLoggedIn && <span className="glowing-orb ml-1.5 hidden md:inline-block"></span>}
                        {item.label === 'Shop' && isLoggedIn && cartItemCount > 0 && (
                          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                            {cartItemCount}
                          </span>
                        )}
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
                      <Button variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground")}>
                        <LogOutIcon className={cn(navIconClasses, "text-card-foreground group-hover:text-accent group-focus-visible:text-accent")} />
                        <span className="hidden md:inline text-sm">Logout</span>
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
