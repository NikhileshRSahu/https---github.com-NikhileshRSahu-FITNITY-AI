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
    <footer className="bg-black/30 text-primary-foreground/80 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4 items-start">
          <div className="space-y-4 md:col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-primary-foreground">Fitnity AI</span>
            </Link>
            <p className="text-sm">
              Your ultimate AI fitness coach. Personalized workouts, real-time form correction, and smart health tracking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-accent transition-colors">
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Fitnity AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
