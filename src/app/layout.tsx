
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Corrected path
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from '@/components/layout/MainHeader';
import MainFooter from '@/components/layout/MainFooter';
import { ThemeProvider } from '@/components/theme-provider';
// import CursorFollower from '@/components/effects/CursorFollower'; // Temporarily commented out
import { CartProvider } from '@/contexts/CartContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'; // Ensure correct import path

const geistSans = GeistSans;
// const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Fitnity AI',
  description: 'Your Ultimate AI Fitness Coach — Anytime, Anywhere',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Or "light" based on desired default
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionProvider> {/* SubscriptionProvider should wrap CartProvider and thus MainHeader */}
            <CartProvider>
              {/* <CursorFollower /> */} {/* Cursor follower can be re-enabled later */}
              <MainHeader />
              <main className="flex-grow">{children}</main>
              <MainFooter />
              <Toaster />
            </CartProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
