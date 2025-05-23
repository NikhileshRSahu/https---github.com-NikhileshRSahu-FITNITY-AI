
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Zap } from 'lucide-react';

export default function MainFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-background/80 text-foreground/80 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
          <div className="space-y-4 md:col-span-1 lg:col-span-1 text-center sm:text-left">
            <Link href="/" className="flex items-center justify-center sm:justify-start gap-2" prefetch={false}>
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-foreground">Fitnity AI</span>
            </Link>
            <p className="text-sm">
              Your ultimate AI fitness coach. Personalized workouts, real-time form correction, and smart health tracking.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-accent transition-colors duration-200 ease-in-out">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-accent transition-colors duration-200 ease-in-out">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-4 justify-center sm:justify-start">
              {socialLinks.map(social => (
                <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-accent transition-colors duration-200 ease-in-out">
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-foreground/20 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Fitnity AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
