
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, type Product } from '@/lib/product-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft, Tag, IndianRupee, Check, Star, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      const foundProduct = products.find(p => p.slug === slug);
      setProduct(foundProduct || null);

      if (foundProduct) {
        const otherProductsInCategory = products.filter(p => p.id !== foundProduct.id && p.category === foundProduct.category);
        let recommendations = otherProductsInCategory.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        if (recommendations.length < 3) {
          const otherRandomProducts = products.filter(p => p.id !== foundProduct.id && p.category !== foundProduct.category)
                                           .sort(() => 0.5 - Math.random())
                                           .slice(0, 3 - recommendations.length);
          recommendations = [...recommendations, ...otherRandomProducts];
        }
        setRelatedProducts(recommendations.slice(0, 3)); // Ensure max 3
      }
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);
    addItem(product);
    toast({
      title: `${product.name} added to cart!`,
      description: "You can view your cart or continue shopping.",
      action: (
        <Button variant="outline" size="sm" onClick={() => router.push('/shop/cart')}>
          View Cart
        </Button>
      )
    });

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000);
  };

  if (product === undefined) { // Initial loading state
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-8 w-36 sm:w-48 bg-muted/50" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          <div>
            <Skeleton className="w-full aspect-square rounded-xl bg-muted/50" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-10 w-3/4 sm:h-12 bg-muted/50" /> 
            <Skeleton className="h-6 w-1/4 sm:h-7 bg-muted/50" /> 
            <Skeleton className="h-20 w-full sm:h-24 bg-muted/50" /> 
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-10 w-32 sm:h-12 bg-muted/50" /> 
              <Skeleton className="h-10 w-24 sm:h-12 bg-muted/50" /> 
            </div>
            <Skeleton className="h-12 w-1/2 sm:h-14 bg-muted/50" /> 
          </div>
        </div>
         <div className="mt-12 sm:mt-16">
          <Skeleton className="h-8 w-1/3 sm:h-9 mb-4 sm:mb-6 bg-muted/50" /> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="glassmorphic-card p-3 sm:p-4 border-transparent"> 
                <Skeleton className="h-32 w-full sm:h-36 mb-2 sm:mb-3 rounded-md bg-muted/50" /> 
                <Skeleton className="h-5 w-3/4 sm:h-6 mb-1 rounded-md bg-muted/50" /> 
                <Skeleton className="h-5 w-1/2 sm:h-6 rounded-md bg-muted/50" /> 
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    // This should ideally be caught by Next.js's notFound() for a better UX
    // but as a fallback:
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 text-center animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl font-bold text-destructive mb-4">Product Not Found</h1>
            <p className="text-foreground/70 mb-6">Sorry, we couldn't find the product you were looking for.</p>
            <Button asChild>
                <Link href="/shop/products">Back to All Products</Link>
            </Button>
        </div>
    );
  }

  const discountPercentage = product.originalPriceINR
    ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
    : null;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-20 animate-fade-in-up">
      <div className="mb-6 sm:mb-8">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 transition-all duration-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto">
          <Link href="/shop/products">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to All Products
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
        <Card className="glassmorphic-card overflow-hidden sticky top-20 md:top-24 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="aspect-square relative">
            <Image
              src={product.imagePlaceholder}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              data-ai-hint={product.aiHint}
              priority
            />
          </div>
        </Card>

        <div className="space-y-4 sm:space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <Card className="glassmorphic-card">
            <CardHeader className="pb-3 sm:pb-4">
              <Link href={`/shop/products?category=${product.category.toLowerCase()}`} className="text-xs sm:text-sm text-accent hover:underline mb-1 flex items-center gap-1">
                 <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {product.category}
              </Link>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center text-foreground">
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-accent">
                  <IndianRupee className="inline h-5 w-5 sm:h-6 sm:w-6 -mt-1 mr-0.5" />{product.priceINR.toLocaleString()}
                </span>
                {product.originalPriceINR && (
                  <span className="text-lg sm:text-xl text-foreground/60 line-through">
                    ₹{product.originalPriceINR.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercentage && (
                <div className="text-xs sm:text-sm font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md inline-block">
                  {discountPercentage}% OFF
                </div>
              )}
              <p className="text-xs sm:text-sm text-foreground/70 mt-0.5 sm:mt-1">
                (Approx. ${product.priceUSD.toLocaleString()})
              </p>
            </CardContent>
          </Card>
          
          <Button
            size="lg"
            className={cn(
              "w-full text-base sm:text-lg py-3 sm:py-3.5 text-accent-foreground cta-glow-pulse active:scale-95 transition-all duration-200",
              isAddingToCart ? "bg-green-500 hover:bg-green-600" : "bg-accent hover:bg-accent/90"
            )}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Check className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add to Cart
              </>
            )}
          </Button>

           <Card className="glassmorphic-card">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground/70">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-accent"/> 
                <span>Delivery by Fitnity | Free Shipping | 30-Day Returns</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((relatedProduct, index) => (
               <div key={relatedProduct.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1 + 0.4}s`}}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

    