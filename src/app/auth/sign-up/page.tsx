
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    console.log('Sign Up submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Account Created!',
      description: 'Welcome to Fitnity AI! Your account has been successfully created.',
    });
    setIsLoading(false);
    // In a real app, you might auto-login or direct to sign-in
    router.push('/auth/sign-in'); 
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg glassmorphic-card">
        <CardHeader className="text-center">
           <div className="inline-flex justify-center items-center mb-4">
            <UserPlus className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join Fitnity AI and start your personalized fitness journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Full Name</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="e.g., Aarav Patel" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormLabel className="text-lg">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="Minimum 8 characters" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Confirm Password</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="password" placeholder="Re-enter your password" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-border/30 bg-background/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="agreeToTerms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="agreeToTerms">
                        I agree to the Fitnity AI{' '}
                        <Link href="/terms-of-service" className="text-accent hover:underline" target="_blank">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="text-accent hover:underline" target="_blank">
                          Privacy Policy
                        </Link>
                        .
                      </FormLabel>
                      <FormMessage />
                    </div>
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
                Create Account
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-medium text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
