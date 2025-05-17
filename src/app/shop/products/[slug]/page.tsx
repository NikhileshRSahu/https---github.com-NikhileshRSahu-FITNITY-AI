
'use client';

import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, type Product } from '@/lib/product-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft, Tag, Info, DollarSign, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined for loading state
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundProduct = products.find(p => p.slug === slug);
      setProduct(foundProduct || null); // null if not found after checking
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAddingToCart(true);
    toast({
      title: `Added to cart: ${product.name} (Demo)`,
      description: 'This is a demo. Cart functionality is not yet implemented.',
    });
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1500); // Simulate adding to cart
  };

  if (product === undefined) { // Loading state
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <Skeleton className="w-full aspect-square rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    // Standard Next.js way to trigger a 404 page for dynamic segments
    notFound();
    return null; // Or a custom "Product Not Found" component
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <div className="mb-8">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 transition-all duration-200">
          <Link href="/shop/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Products
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <Card className="glassmorphic-card overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={product.imagePlaceholder}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              data-ai-hint={product.aiHint}
              priority // Prioritize loading for product image
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</CardTitle>
              <CardDescription className="text-lg text-accent flex items-center gap-2">
                <Tag className="h-5 w-5" /> {product.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                <DollarSign className="mr-2 h-6 w-6 text-accent" /> Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span className="flex items-center text-accent">
                  <IndianRupee className="mr-1 h-6 w-6" />
                  {product.priceINR.toLocaleString()}
                </span>
                {product.originalPriceINR && (
                  <span className="text-lg text-foreground/60 line-through">
                    ₹{product.originalPriceINR.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/70">
                Approx. ${product.priceUSD.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className={cn(
              "w-full text-lg py-3 bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse active:scale-95 transition-all duration-200",
              isAddingToCart && "bg-green-500 hover:bg-green-600"
            )}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAddingToCart ? 'Added to Cart!' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      {/* Placeholder for Related Products or Reviews */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-foreground mb-6">You Might Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glassmorphic-card p-4">
              <Skeleton className="h-32 w-full mb-3 rounded-md" />
              <Skeleton className="h-5 w-3/4 mb-1 rounded-md" />
              <Skeleton className="h-5 w-1/2 rounded-md" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
