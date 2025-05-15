import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from '@/components/layout/MainHeader';
import MainFooter from '@/components/layout/MainFooter';

const geistSans = GeistSans;
const geistMono = GeistMono;

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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased gradient-body-bg min-h-screen flex flex-col`}
      >
        <MainHeader />
        <main className="flex-grow">{children}</main>
        <MainFooter />
        <Toaster />
      </body>
    </html>
  );
}
