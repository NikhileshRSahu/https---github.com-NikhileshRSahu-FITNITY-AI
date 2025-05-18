
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('orderId');
    const total = searchParams.get('total');

    if (!id || !total) {
      router.replace('/shop');
      return;
    }

    setOrderId(id);
    setTotalAmount(parseFloat(total).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2,
    }));
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md sm:max-w-lg glassmorphic-card text-center p-6 sm:p-8">
          <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full mx-auto mb-4 sm:mb-6 bg-muted/50" />
          <Skeleton className="h-7 w-3/4 sm:h-8 mx-auto mb-3 sm:mb-4 bg-muted/50" />
          <Skeleton className="h-5 w-full sm:h-5 mx-auto mb-2 sm:mb-3 bg-muted/50" />
          <Skeleton className="h-5 w-2/3 sm:h-5 mx-auto mb-4 sm:mb-6 bg-muted/50" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Skeleton className="h-10 w-full sm:w-40 sm:h-12 bg-muted/50" />
            <Skeleton className="h-10 w-full sm:w-40 sm:h-12 bg-muted/50" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)] animate-fade-in-up">
      <Card className="w-full max-w-md sm:max-w-lg glassmorphic-card text-center p-6 md:p-8">
        <CardHeader className="p-0">
          <CheckCircle2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500 mb-4 sm:mb-6 animate-pulse" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
            Thank You! Your Order is Confirmed!
          </CardTitle>
          <CardDescription className="text-foreground/80 mt-2 mb-4 sm:mb-6 text-sm sm:text-base">
            Your fitness gear is on its way. Get ready to crush your goals!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-4 sm:space-y-6">
          <div className="p-3 sm:p-4 bg-background/20 rounded-md space-y-1.5 sm:space-y-2 border border-border/30 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-foreground/70">Order ID:</span>
              <span className="font-semibold text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Total Amount:</span>
              <span className="font-semibold text-accent">{totalAmount}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-foreground/70">
            You will receive an email confirmation shortly with your order details and tracking information (simulated).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse active:scale-95 text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3">
              <Link href="/shop/products">
                <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
