
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    console.log('Sign In submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitnityUserLoggedIn', 'true');
    }

    toast({
      title: 'Sign In Successful (Simulated)',
      description: 'Welcome back! You are now signed in.',
    });
    setIsLoading(false);
    router.push('/dashboard'); // Redirect to dashboard or desired page
    router.refresh(); // Force refresh to update header state
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md glassmorphic-card">
        <CardHeader className="text-center">
          <div className="inline-flex justify-center items-center mb-4">
            <LogIn className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your Fitnity AI dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-lg">Password</FormLabel>
                      <Link href="#" className="text-sm text-accent hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse active:scale-95"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="font-medium text-accent hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
