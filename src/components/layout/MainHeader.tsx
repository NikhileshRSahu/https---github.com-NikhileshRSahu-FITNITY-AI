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
import { Zap, LogIn, UserPlus, LayoutDashboard, User as UserIcon, LogOut as LogOutIcon, ClipboardList, Bot, Apple as NutritionIcon, Camera, ShoppingCart, PlayCircle, Settings, Lock, Sparkles, Menu, Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast'; 

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  isCTA?: boolean;
  tooltipText?: string;
  showTextAtBreakpoint?: 'md' | 'lg';
  featureKey?: keyof import('@/contexts/SubscriptionContext').FeatureAccessConfig;
  isPremium?: boolean;
  ariaLabel?: string;
}

export default function MainHeader() {
  const { getItemCount } = useCart();
  const { isFeatureAccessible, mounted: subscriptionMounted } = useSubscription();
  const { toast } = useToast();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkLoginStatus = useCallback(() => {
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkLoginStatus();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fitnityUserLoggedIn') checkLoginStatus();
    };
    const handleLoginStateChange = () => checkLoginStatus();
    
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
  }, [pathname, checkLoginStatus]);

  useEffect(() => {
    if (mounted) {
      setCartItemCount(getItemCount());
    }
  }, [mounted, getItemCount, pathname]);


  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 

    if (typeof window !== 'undefined' && mounted) {
      localStorage.removeItem('fitnityUserLoggedIn');
      window.dispatchEvent(new Event('loginStateChange'));
    }
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    setIsLoggingOut(false);
    router.push('/');
  };
  

  const navLinkBaseClasses = "relative flex items-center justify-center md:justify-start gap-1 px-1 py-1.5 md:px-2 md:py-2 rounded-lg text-sm transition-all duration-300 ease-in-out group border-b-2 border-transparent hover:border-accent focus-visible:border-accent";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-primary dark:hover:text-accent hover:drop-shadow-[0_0_8px_hsl(var(--accent))] focus-visible:text-accent focus-visible:drop-shadow-[0_0_8px_hsl(var(--accent))] hover:bg-transparent focus-visible:bg-accent/10";
  const navIconClasses = "h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 flex-shrink-0 text-foreground group-hover:text-primary dark:group-hover:text-accent group-focus-visible:text-accent transition-colors duration-300";


  const unauthenticatedNavItems: NavItem[] = [
    { href: '/#features', label: 'Features', icon: Zap, tooltipText: 'Explore Features', showTextAtBreakpoint: 'md', ariaLabel: 'Explore Features'},
    { href: '/#pricing', label: 'Pricing', icon: Sparkles, tooltipText: 'View Pricing', showTextAtBreakpoint: 'md', ariaLabel: 'View Pricing Plans'},
    { href: '/shop/products', label: 'Shop', icon: ShoppingCart, tooltipText: 'Browse Shop', showTextAtBreakpoint: 'md', ariaLabel: 'Browse Shop'},
    { href: '/auth/sign-in', label: 'Login', icon: LogIn, tooltipText: 'Login to your account', showTextAtBreakpoint: 'md', ariaLabel: 'Login to your account'},
    { href: '/auth/sign-up', label: 'Sign Up', icon: UserPlus, isCTA: true, tooltipText: 'Create an account', ariaLabel: 'Create an account' },
  ];

  const authenticatedNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltipText: 'View your progress', showTextAtBreakpoint: 'md', ariaLabel: 'View your progress dashboard'},
    { href: '/workout-plan', label: 'Workout', icon: ClipboardList, tooltipText: 'Generate workout plans', showTextAtBreakpoint: 'lg', ariaLabel: 'Generate workout plans' },
    { href: '/nutrition-plan', label: 'Nutrition', icon: NutritionIcon, tooltipText: 'Get nutrition advice', showTextAtBreakpoint: 'lg', featureKey: 'nutritionPlan', isPremium: true, ariaLabel: 'Get nutrition advice' },
    { href: '/videos', label: 'Videos', icon: PlayCircle, tooltipText: 'Watch fitness videos', showTextAtBreakpoint: 'lg', ariaLabel: 'Watch fitness videos' },
    { href: '/form-analysis', label: 'Form Check', icon: Camera, tooltipText: 'Analyze your exercise form', showTextAtBreakpoint: 'lg', featureKey: 'formAnalysis', isPremium: true, ariaLabel: 'Analyze your exercise form' },
    { href: '/ai-coach', label: 'Coach', icon: Bot, tooltipText: 'Chat with your AI Coach', showTextAtBreakpoint: 'lg', ariaLabel: 'Chat with your AI Coach' },
    { href: '/shop', label: 'Shop', icon: ShoppingCart, tooltipText: 'Browse fitness gear', showTextAtBreakpoint: 'md', ariaLabel: 'Browse fitness gear' },
    { href: '/profile', label: 'Profile', icon: UserIcon, tooltipText: 'Manage your profile', showTextAtBreakpoint: 'md', ariaLabel: 'Manage your profile' },
  ];

  const itemsToDisplay = mounted && isLoggedIn ? authenticatedNavItems : unauthenticatedNavItems;

  const baseHeaderClasses = "sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out";
  const baseContainerClasses = "container mx-auto flex items-center justify-between transition-all duration-300 ease-in-out h-full";

  if (!mounted) {
    return (
       <header className={cn(baseHeaderClasses, "h-20 shadow-none dark:shadow-none light:border-b light:border-transparent")}>
         <div className={cn(baseContainerClasses, "px-2 sm:px-4 md:px-3 lg:px-6")}>
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" prefetch={false}>
              <Zap className="h-7 w-7 md:h-8 md:w-8 text-primary dark:text-accent logo-pulse" />
              <span className="text-xl md:text-2xl font-bold text-card-foreground">Fitnity AI</span>
            </Link>
            <nav className="flex items-center gap-0.5 md:gap-0.5 lg:gap-1">
              <div className="h-9 w-10 bg-transparent md:w-20"></div> {/* Placeholder */}
              <div className="h-9 w-10 bg-transparent md:w-20"></div> {/* Placeholder */}
              <div className="h-9 w-10 bg-transparent md:w-28"></div> {/* Placeholder for CTA */}
            </nav>
         </div>
       </header>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <header
        className={cn(
          baseHeaderClasses,
          isScrolled 
            ? "h-16 shadow-lg dark:shadow-accent/10 light:shadow-md light:border-b light:border-border/30" 
            : "h-20 shadow-none dark:shadow-none light:border-b light:border-transparent"
        )}
      >
        <div className={cn(baseContainerClasses, "px-2 sm:px-4 md:px-3 lg:px-6")}>
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" prefetch={false}>
            <Zap className={cn("h-7 w-7 md:h-8 md:w-8", "logo-pulse", "text-primary dark:text-accent")} />
            <span className="text-xl md:text-2xl font-bold text-card-foreground">Fitnity AI</span>
          </Link>
          <nav className="flex items-center gap-0.5 md:gap-0.5 lg:gap-1">
            {itemsToDisplay.map(item => {
              const accessible = item.featureKey && mounted && isLoggedIn ? isFeatureAccessible(item.featureKey) : true;
              const showLockIcon = item.isPremium && !accessible && mounted && isLoggedIn;
              
              const navButtonContent = (
                <div className="flex flex-col items-center md:flex-row">
                    <item.icon className={cn(navIconClasses, showLockIcon && "opacity-50", item.isCTA && "text-inherit group-hover:text-inherit group-focus-visible:text-inherit") } />
                    <span className={cn(
                      "hidden text-sm ml-0 md:ml-1.5",
                      item.showTextAtBreakpoint === 'md' && 'md:inline',
                      item.showTextAtBreakpoint === 'lg' && 'lg:inline',
                       (!item.showTextAtBreakpoint && !(item.label === 'Login' || item.label === 'Sign Up' || item.label === 'Features' || item.label === 'Pricing')) && 'md:inline',
                       (item.label === 'Login' || item.label === 'Sign Up' || item.label === 'Features' || item.label === 'Pricing') && 'md:inline',
                       showLockIcon && "opacity-50",
                       item.isCTA && "text-xs sm:text-sm sm:inline"
                    )}>
                      {item.label}
                    </span>
                    {item.label === 'Coach' && mounted && isLoggedIn && <span className="glowing-orb ml-0.5 md:ml-1.5 hidden md:inline-block"></span>}
                    {item.label === 'Shop' && mounted && isLoggedIn && cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-0.5 md:mt-0 md:mr-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </span>
                    )}
                    {showLockIcon && <Lock className="h-3 w-3 text-amber-500 ml-1 hidden md:inline-block" />}
                  </div>
              );

              const buttonProps = {
                variant: "ghost" as const,
                className: cn(
                  navLinkBaseClasses, 
                  "text-card-foreground px-1.5 sm:px-2 py-1 sm:py-1.5 h-auto hover:border-b-accent",
                   accessible ? navLinkHoverClasses : "cursor-default", // Changed cursor-not-allowed to cursor-default
                   showLockIcon && "opacity-70 hover:opacity-80"
                ),
                "aria-label": item.ariaLabel || item.label,
              };

              const buttonWrapper = (
                 <Button {...buttonProps} asChild={accessible && !showLockIcon}>
                    {(accessible && !showLockIcon) ? <Link href={item.href}>{navButtonContent}</Link> : <div>{navButtonContent}</div>}
                  </Button>
              );

              return item.isCTA ? (
                <Button
                  key={item.href}
                  asChild
                  size="sm"
                  className={cn(
                    "ml-1 md:ml-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg shadow-md transition-all duration-300 ease-in-out text-xs sm:text-sm active:scale-95 h-auto",
                    "light:bg-primary light:text-primary-foreground light:hover:bg-gradient-to-r light:hover:from-primary light:hover:to-accent",
                    "dark:bg-accent dark:hover:bg-accent/80 dark:text-accent-foreground dark:cta-glow-pulse"
                  )}
                  aria-label={item.ariaLabel || item.label}
                >
                  <Link href={item.href} className="flex items-center">
                    <item.icon className={cn(navIconClasses, "mr-1 md:mr-1.5 h-4 w-4 sm:h-4.5 sm:w-4.5", "text-inherit group-hover:text-inherit group-focus-visible:text-inherit")} />
                    <span className={cn(item.label === 'Sign Up' ? "sm:hidden md:inline" : "hidden sm:inline")}>{item.label}</span>
                     <span className={cn(item.label === 'Sign Up' ? "inline md:hidden" : "sm:hidden")}>{item.label}</span>
                  </Link>
                </Button>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {showLockIcon ? (
                       <AlertDialog>
                         <AlertDialogTrigger asChild>
                           {buttonWrapper}
                         </AlertDialogTrigger>
                         <AlertDialogContent className="glassmorphic-card">
                           <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-primary dark:text-yellow-400"/> Premium Feature Locked
                            </AlertDialogTitle>
                             <AlertDialogDescription className="text-card-foreground/70">
                               The "{item.label}" feature requires a Premium or Unlimited subscription. Upgrade your plan to unlock access and supercharge your fitness journey!
                             </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                             <AlertDialogCancel>Cancel</AlertDialogCancel>
                             <AlertDialogAction asChild className="bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground">
                               <Link href="/#pricing">View Plans</Link>
                             </AlertDialogAction>
                           </AlertDialogFooter>
                         </AlertDialogContent>
                       </AlertDialog>
                    ) : (
                      buttonWrapper
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border shadow-md">
                    <p>{item.tooltipText || item.label} {showLockIcon ? "(Premium - Upgrade to Access)" : ""}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {mounted && isLoggedIn && (
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className={cn(navLinkBaseClasses, 
                        "text-card-foreground px-1.5 sm:px-2 py-1 sm:py-1.5 h-auto hover:border-b-accent",
                        navLinkHoverClasses
                        )}
                        aria-label="Logout"
                        >
                        <div className="flex flex-col items-center md:flex-row">
                          <LogOutIcon className={cn(navIconClasses)} />
                          <span className="hidden md:inline text-sm ml-0 md:ml-1.5">Logout</span>
                        </div>
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden bg-popover text-popover-foreground border-border shadow-md">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent className="glassmorphic-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><LogOutIcon className="mr-2 h-5 w-5 text-primary dark:text-accent"/>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription className="text-card-foreground/70">
                       Are you sure you want to logout from Fitnity AI?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut} className="bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground active:scale-95">
                      {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
