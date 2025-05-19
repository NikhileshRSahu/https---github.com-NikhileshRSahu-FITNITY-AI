
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from '@/components/layout/MainHeader';
import MainFooter from '@/components/layout/MainFooter';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/contexts/CartContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'; 
import BackToTopButton from '@/components/layout/BackToTopButton';


const geistSans = GeistSans;

export const metadata: Metadata = {
  title: {
    default: "Fitnity AI - Your Ultimate AI Fitness Coach",
    template: "%s - Fitnity AI",
  },
  description: 'Your Ultimate AI Fitness Coach — Anytime, Anywhere. Real-time form correction, personalized AI workouts, and smart health tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionProvider> 
            <CartProvider>
              {/* <CursorFollower /> */} {/* Cursor follower can be re-enabled if desired */}
              <MainHeader />
              <main className="flex-grow">{children}</main>
              <MainFooter />
              <Toaster />
              <BackToTopButton />
            </CartProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
