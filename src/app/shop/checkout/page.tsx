
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee, MapPin, CreditCard, Package, Loader2, AlertTriangle, WalletCards, Milestone } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const shippingSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  addressLine1: z.string().min(5, { message: 'Address line 1 is required.' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City is required.' }),
  postalCode: z.string().min(5, { message: 'Valid postal code is required.' }).regex(/^\d{5,6}$/, { message: 'Enter a valid postal code (5 or 6 digits).' }),
  country: z.string({ required_error: 'Please select a country.' }),
  phone: z.string().min(10, { message: 'Valid phone number is required.' }).regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: 'Enter a valid phone number.' }),
});

const cardPaymentSchema = z.object({
  paymentMethod: z.literal('card'),
  cardholderName: z.string().min(3, { message: 'Cardholder name is required.' }),
  cardNumber: z.string().length(16, { message: 'Card number must be 16 digits.' }).regex(/^\d{16}$/, { message: 'Enter a valid 16-digit card number.' }),
  expiryDate: z.string().length(5, { message: 'Expiry date must be MM/YY.' }).regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Enter a valid MM/YY expiry date.' }),
  cvv: z.string().min(3, { message: 'CVV must be 3 or 4 digits.' }).max(4).regex(/^\d{3,4}$/, { message: 'Enter a valid CVV (3 or 4 digits).' }),
  upiId: z.string().optional(), // Make UPI ID optional when card is selected
});

const upiPaymentSchema = z.object({
  paymentMethod: z.literal('upi'),
  upiId: z.string().min(5, { message: 'UPI ID must be at least 5 characters.' }).regex(/^[a-zA-Z0-9.\-_@]+$/, {message: 'Enter a valid UPI ID (e.g., yourname@bank).' }),
  // Make card fields optional when UPI is selected
  cardholderName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

const checkoutSchema = z.intersection(
  shippingSchema,
  z.discriminatedUnion('paymentMethod', [
    cardPaymentSchema,
    upiPaymentSchema,
  ])
);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { state, getItemCount, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'India',
      paymentMethod: 'card',
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      phone: '',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  useEffect(() => {
    if (state.items !== undefined) {
      setIsLoadingCart(false);
      if (getItemCount() === 0) {
        toast({
          title: 'Your cart is empty!',
          description: 'Please add items to your cart before proceeding to checkout.',
          variant: 'destructive',
        });
        router.replace('/shop/cart');
      }
    }
  }, [state.items, getItemCount, router, toast]);


  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    setIsProcessing(true);
    console.log('Checkout data (simulated):', JSON.stringify(data, null, 2));

    // Clear fields not relevant to the chosen payment method before "sending"
    let processedData: any = { ...data };
    if (data.paymentMethod === 'card') {
      delete processedData.upiId;
    } else if (data.paymentMethod === 'upi') {
      delete processedData.cardholderName;
      delete processedData.cardNumber;
      delete processedData.expiryDate;
      delete processedData.cvv;
    }
    console.log('Processed data for submission:', JSON.stringify(processedData, null, 2));


    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: 'Order Placed Successfully! (Simulated)',
      description: 'Thank you for your purchase. Your order is being processed.',
    });
    
    const orderDetails = {
      orderId: `FIT-${Date.now()}`,
      totalAmount: getCartTotal(),
      items: state.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.priceINR })),
    };

    clearCart();
    setIsProcessing(false);
    router.push(`/shop/order-confirmation?orderId=${orderDetails.orderId}&total=${orderDetails.totalAmount}`);
  };

  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <Skeleton className="h-12 sm:h-16 w-1/2" />
            <Skeleton className="h-60 sm:h-72 w-full" />
            <Skeleton className="h-52 sm:h-64 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-8 sm:h-10 w-3/4 mb-4 sm:mb-6" />
            <Skeleton className="h-80 sm:h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (getItemCount() === 0 && !isLoadingCart) {
    // This state should ideally be caught by the useEffect, but as a fallback:
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
        <AlertTriangle className="h-16 w-16 sm:h-20 sm:w-20 text-destructive mb-4 sm:mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Cart is Empty</h1>
        <p className="text-foreground/70 mb-6 sm:mb-8 text-sm sm:text-base">Redirecting you to your cart...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20 animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 text-center">Checkout</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
                  <MapPin className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-accent" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5">
                <FormField name="fullName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Full Name</FormLabel>
                    <FormControl><Input placeholder="Aarav Patel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="addressLine1" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Address Line 1</FormLabel>
                    <FormControl><Input placeholder="123 Fitness Street" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="addressLine2" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Address Line 2 (Optional)</FormLabel>
                    <FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField name="city" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">City</FormLabel>
                      <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="postalCode" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Postal Code</FormLabel>
                      <FormControl><Input placeholder="400001" {...field} /></FormControl>
                      <FormDescription className="text-xs text-card-foreground/70">E.g., 12345 or 123456</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField name="country" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
                    <FormDescription className="text-xs text-card-foreground/70">For delivery updates.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
                  <CreditCard className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-accent" /> Payment Method
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Payment processing is simulated for this demo.</CardDescription>
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
                          <FormItem className={cn("flex items-center space-x-2 p-3 rounded-md bg-background/20 border  flex-1 transition-all duration-200 cursor-pointer", paymentMethod === 'card' ? 'border-accent ring-2 ring-accent shadow-md' : 'border-border/30 hover:border-accent/70')}>
                            <FormControl>
                              <RadioGroupItem value="card" id="card-payment" />
                            </FormControl>
                            <FormLabel htmlFor="card-payment" className="font-normal flex items-center gap-2 cursor-pointer text-sm sm:text-base text-card-foreground">
                              <WalletCards className="h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Credit/Debit Card
                            </FormLabel>
                          </FormItem>
                          <FormItem className={cn("flex items-center space-x-2 p-3 rounded-md bg-background/20 border flex-1 transition-all duration-200 cursor-pointer", paymentMethod === 'upi' ? 'border-accent ring-2 ring-accent shadow-md' : 'border-border/30 hover:border-accent/70')}>
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

                {paymentMethod === 'card' && (
                  <div className="space-y-4 sm:space-y-5 pt-2">
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

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 sm:space-y-5 pt-2">
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
          </div>

          <div className="md:col-span-1">
            <Card className="glassmorphic-card p-4 sm:p-6 sticky top-20 md:top-24 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <CardHeader className="p-0 mb-4 sm:mb-6">
                <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center">
                  <Package className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-accent" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3 sm:space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-2 sm:gap-3 border-b border-border/20 pb-2.5 sm:pb-3 last:border-b-0">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-md overflow-hidden flex-shrink-0 border border-border/20">
                        <Image src={item.imagePlaceholder} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm sm:text-base font-medium text-card-foreground truncate pr-2">{item.name}</p>
                      <p className="text-xs text-card-foreground/70">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-card-foreground">
                      <IndianRupee className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 -mt-0.5" />
                      {(item.priceINR * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between text-card-foreground/80">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold"><IndianRupee className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-card-foreground/80">
                    <span className="font-medium">Shipping</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-card-foreground/80">
                    <span className="font-medium">Estimated Taxes</span>
                    <span className="text-card-foreground/70">Calculated at next step</span>
                  </div>
                  <hr className="my-2 sm:my-3 border-border/30" />
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-card-foreground">
                    <span>Total</span>
                    <span><IndianRupee className="inline h-4 w-4 sm:h-5 sm:w-5 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full mt-5 sm:mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg sm:text-xl cta-glow-pulse active:scale-95 px-6 py-3 sm:h-14"
                  disabled={isProcessing || (!form.formState.isValid && form.formState.isSubmitted)}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : null}
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

    