'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const newsletterFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export default function NewsletterSignupSection() {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: NewsletterFormValues) {
    // Simulate API call
    console.log('Newsletter signup:', data);
    toast({
      title: 'Subscribed!',
      description: "Thanks for joining the Fitnity Community! We'll keep you updated.",
      variant: 'default',
    });
    form.reset();
  }

  return (
    <section id="newsletter" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary-foreground mb-6">
            Join the Fitnity Community
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Stay updated with the latest news, features, and fitness tips from Fitnity AI.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-start">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow w-full">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="h-14 text-lg bg-white/20 text-primary-foreground placeholder:text-primary-foreground/60 border-white/30 focus:ring-accent focus:border-accent"
                      />
                    </FormControl>
                    <FormMessage className="text-left text-red-400" />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-14 bg-accent hover:bg-accent/90 text-accent-foreground px-8 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 text-lg w-full sm:w-auto">
                Join Community
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
