
'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { IndianRupee, PlusCircle, MinusCircle, Trash2, ShoppingCart, XCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { state, removeItem, updateQuantity, getCartTotal, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    } else if (newQuantity === 0) {
      removeItem(id);
       toast({ title: "Item removed from cart", variant: "default" });
    }
  };

  const handleInputChange = (id: string, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    } else if (value === '' || (!isNaN(newQuantity) && newQuantity === 0)) {
        // Allow empty or zero input temporarily, handle on blur or if user tries to proceed
    }
  };

  const handleInputBlur = (id: string, currentValue: string) => {
    const currentQuantityNum = parseInt(currentValue, 10);
    if (currentValue === '' || isNaN(currentQuantityNum) || currentQuantityNum <= 0) {
      updateQuantity(id, 1); 
      toast({ title: "Quantity updated to 1", description: "Minimum quantity is 1.", variant: "default" });
    }
  };
  
  const handleProceedToCheckout = () => {
    if (getItemCount() > 0) {
      router.push('/shop/checkout');
    } else {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
    }
  };


  if (getItemCount() === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center animate-fade-in-up min-h-[calc(100vh-10rem)]">
        <XCircle className="h-20 w-20 sm:h-24 sm:w-24 text-destructive mb-6 sm:mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-5">Your Cart is Empty</h1>
        <p className="text-foreground/70 mb-8 sm:mb-10 max-w-md text-base sm:text-lg">
          Looks like you haven't added any items to your cart yet. Explore our shop to find amazing fitness gear!
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-3.5">
          <Link href="/shop/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20 animate-fade-in-up">
      <CardHeader className="px-0 mb-6 sm:mb-8 text-center md:text-left">
        <CardTitle className="text-3xl sm:text-4xl md:text-4xl font-bold text-foreground flex items-center justify-center md:justify-start">
          <ShoppingCart className="mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10 text-accent" /> Your Shopping Cart
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-foreground/80 mt-1">
          Review items in your cart and proceed to checkout. You have {getItemCount()} item(s) in your cart.
        </CardDescription>
      </CardHeader>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {state.items.map((item, index) => (
            <Card 
              key={item.id} 
              className="glassmorphic-card flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:shadow-accent/20 transition-shadow duration-300 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-md overflow-hidden flex-shrink-0 border border-border/20">
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
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-0.5">{item.name}</h3>
                </Link>
                <p className="text-xs sm:text-sm text-card-foreground/70">{item.category}</p>
                <p className="text-base sm:text-lg font-medium text-accent mt-1 sm:mt-1.5">
                  <IndianRupee className="inline h-4 w-4 sm:h-4.5 sm:w-4.5 -mt-0.5" />{item.priceINR.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 my-2 sm:my-0">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="h-8 w-8 sm:h-9 sm:w-9 text-accent hover:bg-accent/10">
                  <MinusCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onBlur={(e) => handleInputBlur(item.id, e.target.value)}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  className="h-9 w-14 sm:h-10 sm:w-16 text-center bg-background/30 border-border/50 focus:ring-accent text-sm sm:text-base"
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="h-8 w-8 sm:h-9 sm:w-9 text-accent hover:bg-accent/10">
                  <PlusCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <p className="font-semibold text-card-foreground text-base sm:text-xl w-28 sm:w-32 text-center sm:text-right">
                <IndianRupee className="inline h-4 w-4 sm:h-5 sm:w-5 -mt-0.5" />{(item.priceINR * item.quantity).toLocaleString()}
              </p>
              <Button variant="ghost" size="icon" onClick={() => { removeItem(item.id); toast({ title: `${item.name} removed from cart`}); }} className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="glassmorphic-card p-4 sm:p-6 sticky top-20 md:top-24 animate-fade-in-up" style={{animationDelay: `${state.items.length * 0.1 + 0.1}s`}}>
            <CardHeader className="p-0 mb-4 sm:mb-5">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-card-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2.5 sm:space-y-3 text-sm sm:text-base">
              <div className="flex justify-between text-card-foreground/80">
                <span className="font-medium">Subtotal ({getItemCount()} items)</span>
                <span className="font-semibold"><IndianRupee className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-card-foreground/80">
                <span className="font-medium">Shipping</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
               <div className="flex justify-between text-card-foreground/80">
                <span className="font-medium">Estimated Taxes</span>
                <span className="text-card-foreground/70">Calculated at checkout</span>
              </div>
              <hr className="my-2 sm:my-3 border-border/30" />
              <div className="flex justify-between text-lg sm:text-xl font-bold text-card-foreground">
                <span>Total</span>
                <span><IndianRupee className="inline h-4 w-4 sm:h-5 sm:w-5 -mt-0.5" />{getCartTotal().toLocaleString()}</span>
              </div>
              <Button 
                size="lg" 
                className="w-full mt-5 sm:mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg sm:text-xl cta-glow-pulse active:scale-95 px-6 py-3 sm:h-14"
                onClick={handleProceedToCheckout}
                disabled={getItemCount() === 0}
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    