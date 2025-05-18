
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee, MapPin, CreditCard, Package, Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const shippingSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  addressLine1: z.string().min(5, { message: 'Address line 1 is required.' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City is required.' }),
  postalCode: z.string().min(5, { message: 'Valid postal code is required.' }).regex(/^\d{5,6}$/, { message: 'Enter a valid postal code (5 or 6 digits).' }),
  country: z.string({ required_error: 'Please select a country.' }),
  phone: z.string().min(10, { message: 'Valid phone number is required.' }).regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, { message: 'Enter a valid phone number.' }),
});

const paymentSchema = z.object({
  cardholderName: z.string().min(3, { message: 'Cardholder name is required.' }),
  cardNumber: z.string().length(16, { message: 'Card number must be 16 digits.' }).regex(/^\d{16}$/, { message: 'Enter a valid 16-digit card number.' }),
  expiryDate: z.string().length(5, { message: 'Expiry date must be MM/YY.' }).regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Enter a valid MM/YY expiry date.' }),
  cvv: z.string().min(3, { message: 'CVV must be 3 or 4 digits.' }).max(4).regex(/^\d{3,4}$/, { message: 'Enter a valid CVV (3 or 4 digits).' }),
});

const checkoutSchema = shippingSchema.merge(paymentSchema);
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
      country: 'India', // Default country
      // Pre-fill with some dummy data for faster testing, remove in production
      // fullName: 'Aarav Patel',
      // addressLine1: '123 Fitnity Lane',
      // city: 'Mumbai',
      // postalCode: '400001',
      // phone: '9876543210',
      // cardholderName: 'Aarav Patel',
      // cardNumber: '1234567812345678',
      // expiryDate: '12/25',
      // cvv: '123',
    },
  });

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
    console.log('Checkout data (simulated):', data);

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
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-16 w-1/2" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (getItemCount() === 0 && !isLoadingCart) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
        <AlertTriangle className="h-20 w-20 text-destructive mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Cart is Empty</h1>
        <p className="text-foreground/70 mb-8">Redirecting you to your cart...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Checkout</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="md:col-span-2 space-y-8">
            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <MapPin className="mr-3 h-6 w-6 text-accent" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="fullName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Aarav Patel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="addressLine1" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl><Input placeholder="123 Fitness Street" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="addressLine2" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField name="city" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="postalCode" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl><Input placeholder="400001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField name="country" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="glassmorphic-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <CreditCard className="mr-3 h-6 w-6 text-accent" /> Payment Details
                </CardTitle>
                <CardDescription className="text-sm text-card-foreground/70">Payment processing is simulated for this demo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField name="cardholderName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl><Input placeholder="Aarav Patel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="cardNumber" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField name="expiryDate" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (MM/YY)</FormLabel>
                      <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="cvv" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl><Input placeholder="123" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="glassmorphic-card p-6 sticky top-24">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <Package className="mr-3 h-6 w-6 text-accent" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-3 border-b border-border/20 pb-3 last:border-b-0">
                    <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0 border border-border/20">
                        <Image src={item.imagePlaceholder} alt={item.name} fill className="object-cover" data-ai-hint={item.aiHint} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
                      <p className="text-xs text-card-foreground/70">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">
                      <IndianRupee className="inline h-3.5 w-3.5 -mt-0.5" />
                      {(item.priceINR * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-card-foreground/80">
                    <span>Subtotal</span>
                    <span><IndianRupee className="inline h-4 w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-card-foreground/80">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-card-foreground/80">
                    <span>Estimated Taxes</span>
                    <span className="text-card-foreground/70">Calculated at next step</span>
                  </div>
                  <hr className="my-2 border-border/30" />
                  <div className="flex justify-between text-xl font-bold text-card-foreground">
                    <span>Total</span>
                    <span><IndianRupee className="inline h-4 w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg cta-glow-pulse active:scale-95"
                  disabled={isProcessing || !form.formState.isValid && form.formState.isSubmitted}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
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
