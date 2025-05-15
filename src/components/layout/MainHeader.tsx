
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, BarChart3, BotMessageSquare, Camera, UserCircle, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkBaseClasses = "flex items-center justify-center md:justify-start gap-1 md:gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300 ease-in-out";
  const navLinkHoverClasses = "hover:translate-y-[-2px] hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))]";
  const navIconClasses = "h-5 w-5 flex-shrink-0";

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full glassmorphic-card transition-all duration-300 ease-in-out",
        isScrolled ? "shadow-xl shadow-accent/20 h-16" : "h-20"
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
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/workout-plan", icon: BarChart3, label: "Workout Plan" },
            { href: "/form-analysis", icon: Camera, label: "Form Analysis" },
            { href: "/ai-coach", icon: BotMessageSquare, label: "AI Coach", hasOrb: true },
            { href: "/profile", icon: UserCircle, label: "Profile" },
          ].map((item) => (
            <Button key={item.label} asChild variant="ghost" className={cn(navLinkBaseClasses, navLinkHoverClasses, "text-card-foreground hover:bg-transparent focus-visible:bg-accent/10")}>
              <Link href={item.href}>
                <item.icon className={navIconClasses} />
                <span className="hidden md:inline">{item.label}</span>
                {item.hasOrb && (
                  <span className="ml-1 hidden md:inline-block glowing-orb"></span>
                )}
              </Link>
            </Button>
          ))}
          <Button 
            asChild 
            variant="default" 
            className={cn(
              "ml-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out text-sm text-accent-foreground",
              "bg-gradient-to-r from-[hsl(var(--accent)_/_0.9)] via-[hsl(var(--primary)_/_0.9)] to-[hsl(var(--accent)_/_0.9)] hover:shadow-[0_0_15px_3px_hsl(var(--accent)_/_0.7)] hover:scale-105 cta-glow-pulse"
            )}
          >
            <Link href="/#pricing">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
