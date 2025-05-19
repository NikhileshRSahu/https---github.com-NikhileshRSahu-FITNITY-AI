
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext'; // Though not directly used for items, could be for user session
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee, CreditCard, Package, Loader2, AlertTriangle, WalletCards, Milestone, Sparkles, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { plansData, getPlanById, type Plan } from '@/lib/plans'; // Import plan data

// Define separate schemas for card and UPI payments
const cardPaymentSchema = z.object({
  paymentMethod: z.literal('card'),
  cardholderName: z.string().min(3, { message: 'Cardholder name is required.' }),
  cardNumber: z.string().length(16, { message: 'Card number must be 16 digits.' }).regex(/^\d{16}$/, { message: 'Enter a valid 16-digit card number.' }),
  expiryDate: z.string().length(5, { message: 'Expiry date must be MM/YY.' }).regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Enter a valid MM/YY expiry date.' }),
  cvv: z.string().min(3, { message: 'CVV must be 3 or 4 digits.' }).max(4).regex(/^\d{3,4}$/, { message: 'Enter a valid CVV (3 or 4 digits).' }),
  upiId: z.string().optional(), // UPI ID is optional when card is selected
});

const upiPaymentSchema = z.object({
  paymentMethod: z.literal('upi'),
  upiId: z.string().min(5, { message: 'UPI ID must be at least 5 characters.' }).regex(/^[a-zA-Z0-9.\-_@]+$/, {message: 'Enter a valid UPI ID (e.g., yourname@bank).' }),
  cardholderName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

// Combine with a discriminated union
const subscriptionCheckoutSchema = z.discriminatedUnion('paymentMethod', [
  cardPaymentSchema,
  upiPaymentSchema,
]);

type SubscriptionCheckoutFormValues = z.infer<typeof subscriptionCheckoutSchema>;

export default function SubscriptionCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setSubscriptionTier, mounted: subscriptionMounted } = useSubscription();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [calculatedPriceINR, setCalculatedPriceINR] = useState(0);
  const [calculatedPriceUSD, setCalculatedPriceUSD] = useState(0);

  const form = useForm<SubscriptionCheckoutFormValues>({
    resolver: zodResolver(subscriptionCheckoutSchema),
    defaultValues: {
      paymentMethod: 'card',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
    },
  });

  const paymentMethodWatcher = form.watch('paymentMethod');

  useEffect(() => {
    const planId = searchParams.get('plan') as SubscriptionTier | null;
    const cycle = searchParams.get('cycle') as 'monthly' | 'annual' | null;

    if (planId && cycle && (planId === 'premium' || planId === 'unlimited')) {
      const planDetails = getPlanById(planId);
      setSelectedPlan(planDetails);
      setBillingCycle(cycle);
      if (planDetails) {
        const discountFactor = 0.8;
        if (cycle === 'annual') {
          setCalculatedPriceINR(Math.round(planDetails.priceMonthlyInr * 12 * discountFactor));
          setCalculatedPriceUSD(Math.round(planDetails.priceMonthlyUsd * 12 * discountFactor));
        } else {
          setCalculatedPriceINR(planDetails.priceMonthlyInr);
          setCalculatedPriceUSD(planDetails.priceMonthlyUsd);
        }
      }
    } else {
      toast({ title: 'Invalid Plan', description: 'Please select a valid subscription plan.', variant: 'destructive' });
      router.replace('/#pricing');
    }
    setIsLoadingPage(false);
  }, [searchParams, router, toast]);

  const onSubmit: SubmitHandler<SubscriptionCheckoutFormValues> = async (data) => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    
    let paymentData = { ...data };
    if (data.paymentMethod === 'card') delete paymentData.upiId;
    else if (data.paymentMethod === 'upi') {
      delete paymentData.cardholderName;
      delete paymentData.cardNumber;
      delete paymentData.expiryDate;
      delete paymentData.cvv;
    }
    console.log('Subscription Checkout data (simulated):', JSON.stringify(paymentData, null, 2));

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing

    setSubscriptionTier(selectedPlan.id as SubscriptionTier);
    toast({
      title: 'Subscription Successful!',
      description: `You've successfully subscribed to the ${selectedPlan.displayName} plan.`,
    });
    
    setIsProcessing(false);
    router.push(`/subscribe/confirmation?plan=${selectedPlan.id}&cycle=${billingCycle}`);
  };

  if (isLoadingPage || !selectedPlan) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20">
        <Skeleton className="h-12 sm:h-16 w-1/2 mx-auto mb-8 sm:mb-10" />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <Skeleton className="h-60 sm:h-72 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-40 sm:h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20 animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 text-center">
        Subscribe to Fitnity AI - {selectedPlan.displayName}
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
                  <CreditCard className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-accent" /> Payment Details
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-card-foreground/70">All transactions are secure (simulated).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5">
                 <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-2.5">
                      <FormLabel className="text-sm sm:text-base font-medium text-card-foreground">Choose Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                          <FormItem className={cn("flex items-center space-x-2 p-3 rounded-md bg-background/20 border  flex-1 transition-all duration-200 cursor-pointer", paymentMethodWatcher === 'card' ? 'border-accent ring-2 ring-accent shadow-md' : 'border-border/30 hover:border-accent/70')}>
                            <FormControl>
                              <RadioGroupItem value="card" id="card-payment" />
                            </FormControl>
                            <FormLabel htmlFor="card-payment" className="font-normal flex items-center gap-2 cursor-pointer text-sm sm:text-base text-card-foreground">
                              <WalletCards className="h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Credit/Debit Card
                            </FormLabel>
                          </FormItem>
                          <FormItem className={cn("flex items-center space-x-2 p-3 rounded-md bg-background/20 border flex-1 transition-all duration-200 cursor-pointer", paymentMethodWatcher === 'upi' ? 'border-accent ring-2 ring-accent shadow-md' : 'border-border/30 hover:border-accent/70')}>
                            <FormControl>
                              <RadioGroupItem value="upi" id="upi-payment" />
                            </FormControl>
                            <FormLabel htmlFor="upi-payment" className="font-normal flex items-center gap-2 cursor-pointer text-sm sm:text-base text-card-foreground">
                              <Milestone className="h-5 w-5 sm:h-6 sm:w-6 text-accent" /> UPI
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {paymentMethodWatcher === 'card' && (
                  <div className="space-y-4 sm:space-y-5 pt-2 animate-fade-in-up">
                    <FormField name="cardholderName" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Cardholder Name</FormLabel>
                        <FormControl><Input placeholder="Aarav Patel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="cardNumber" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Card Number</FormLabel>
                        <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <FormField name="expiryDate" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Expiry Date</FormLabel>
                          <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                           <FormDescription className="text-xs text-card-foreground/70">Enter in MM/YY format.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField name="cvv" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">CVV</FormLabel>
                          <FormControl><Input placeholder="123" {...field} /></FormControl>
                          <FormDescription className="text-xs text-card-foreground/70">3 or 4 digit code.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                )}

                {paymentMethodWatcher === 'upi' && (
                  <div className="space-y-4 sm:space-y-5 pt-2 animate-fade-in-up">
                    <FormField name="upiId" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">UPI ID</FormLabel>
                        <FormControl><Input placeholder="yourname@bank" {...field} /></FormControl>
                        <FormDescription className="text-xs text-card-foreground/70">You'll receive a payment request on your UPI app.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </CardContent>
            </Card>
             <Card className="glassmorphic-card animate-fade-in-up p-4" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-green-400" />
                    <p className="text-sm text-foreground/80">
                        Secure Payment Simulation. Your data is not actually processed or stored.
                    </p>
                </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="glassmorphic-card p-4 sm:p-6 sticky top-20 md:top-24 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <CardHeader className="p-0 mb-4 sm:mb-6">
                <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
                  <Sparkles className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-accent" /> Subscription Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-base sm:text-lg">
                  <span className="font-medium text-card-foreground">Plan:</span>
                  <span className="font-bold text-accent">{selectedPlan.displayName}</span>
                </div>
                 <div className="flex justify-between items-center text-base sm:text-lg">
                  <span className="font-medium text-card-foreground">Billing Cycle:</span>
                  <span className="font-semibold text-card-foreground capitalize">{billingCycle}</span>
                </div>
                <hr className="my-2 sm:my-3 border-border/30" />
                <div className="flex justify-between text-lg sm:text-xl font-bold text-card-foreground">
                  <span>Total Due:</span>
                  <span>
                    <IndianRupee className="inline h-4 w-4 sm:h-5 sm:w-5 -mt-0.5" />{calculatedPriceINR.toLocaleString()}
                    <span className="text-sm font-normal text-card-foreground/70 ml-1">(${calculatedPriceUSD.toLocaleString()})</span>
                  </span>
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full mt-5 sm:mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg sm:text-xl cta-glow-pulse active:scale-95 px-6 py-3 sm:h-14"
                  disabled={isProcessing || (!form.formState.isValid && form.formState.isSubmitted)}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : null}
                  {isProcessing ? 'Processing...' : `Subscribe to ${selectedPlan.displayName}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
