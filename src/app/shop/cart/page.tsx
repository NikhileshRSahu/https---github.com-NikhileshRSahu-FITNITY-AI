
'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { IndianRupee, PlusCircle, MinusCircle, Trash2, ShoppingCart, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input'; // For quantity input
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { state, removeItem, updateQuantity, getCartTotal, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter(); // If you need navigation

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    } else if (newQuantity === 0) {
      // Optionally confirm removal or just remove
      removeItem(id);
       toast({ title: "Item removed from cart", variant: "default" });
    }
  };

  const handleInputChange = (id: string, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    } else if (value === '' || newQuantity === 0) {
        // Allow temporary empty input or 0 to then remove or set to 1
        // For simplicity, we'll just re-affirm 1 if they try to empty or 0 directly via input.
        // Better UX might involve a "remove" confirmation if input is cleared.
        updateQuantity(id, 1);
    }
  };
  
  const handleProceedToCheckout = () => {
    // In a real app, you'd navigate to the checkout page
    toast({
      title: "Redirecting to Checkout (Demo)",
      description: "Checkout functionality is not yet implemented.",
    });
    // router.push('/shop/checkout'); // Uncomment when checkout page exists
  };


  if (getItemCount() === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center animate-fade-in-up">
        <XCircle className="h-20 w-20 text-destructive mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-foreground/70 mb-8 max-w-md">
          Looks like you haven't added any items to your cart yet. Explore our shop to find amazing fitness gear!
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse">
          <Link href="/shop/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <CardHeader className="px-0 mb-8 text-center md:text-left">
        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center md:justify-start">
          <ShoppingCart className="mr-3 h-8 w-8 text-accent" /> Your Shopping Cart
        </CardTitle>
        <CardDescription className="text-lg text-foreground/80 mt-1">
          Review items in your cart and proceed to checkout.
        </CardDescription>
      </CardHeader>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {state.items.map(item => (
            <Card key={item.id} className="glassmorphic-card flex flex-col sm:flex-row items-center gap-4 p-4">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imagePlaceholder}
                  alt={item.name}
                  fill
                  className="object-cover"
                  data-ai-hint={item.aiHint}
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/shop/products/${item.slug}`} className="hover:text-accent transition-colors">
                  <h3 className="text-lg font-semibold text-card-foreground">{item.name}</h3>
                </Link>
                <p className="text-sm text-card-foreground/70">{item.category}</p>
                <p className="text-base font-medium text-accent mt-1">
                  <IndianRupee className="inline h-4 w-4 -mt-0.5" />{item.priceINR.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3 my-2 sm:my-0">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="h-8 w-8 text-accent hover:bg-accent/10">
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  className="h-9 w-14 text-center bg-background/30 border-border/50 focus:ring-accent"
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="h-8 w-8 text-accent hover:bg-accent/10">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <p className="font-semibold text-card-foreground text-lg w-28 text-center sm:text-right">
                <IndianRupee className="inline h-4 w-4 -mt-0.5" />{(item.priceINR * item.quantity).toLocaleString()}
              </p>
              <Button variant="ghost" size="icon" onClick={() => { removeItem(item.id); toast({ title: `${item.name} removed from cart`}); }} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="glassmorphic-card p-6 sticky top-24"> {/* Added sticky top for summary */}
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-semibold text-card-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex justify-between text-card-foreground/80">
                <span>Subtotal ({getItemCount()} items)</span>
                <span><IndianRupee className="inline h-4 w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-card-foreground/80">
                <span>Shipping</span>
                <span className="text-green-500">FREE</span>
              </div>
              <hr className="my-2 border-border/30" />
              <div className="flex justify-between text-xl font-bold text-card-foreground">
                <span>Total</span>
                <span><IndianRupee className="inline h-4 w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
              </div>
              <Button 
                size="lg" 
                className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg cta-glow-pulse active:scale-95"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Added this at the end of file as it was missing from the initial prompt image.
// Usually `useRouter` is imported from `next/navigation`.
import { useRouter } from 'next/navigation';

