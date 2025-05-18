
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
        const otherProducts = products.filter(p => p.id !== foundProduct.id);
        setRelatedProducts(otherProducts.sort(() => 0.5 - Math.random()).slice(0, 3)); // Show 3 related products
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

  if (product === undefined) {
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
         <div className="mt-16">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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

  if (!product) {
    notFound();
    return null;
  }

  const discountPercentage = product.originalPriceINR
    ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
    : null;

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
        <Card className="glassmorphic-card overflow-hidden sticky top-24">
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

        <div className="space-y-6">
          <Card className="glassmorphic-card">
            <CardHeader>
              <Link href={`/shop/products?category=${product.category.toLowerCase()}`} className="text-sm text-accent hover:underline mb-1 flex items-center gap-1">
                 <Tag className="h-4 w-4" /> {product.category}
              </Link>
              <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-foreground">
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-accent">
                  <IndianRupee className="inline h-6 w-6 -mt-1 mr-0.5" />{product.priceINR.toLocaleString()}
                </span>
                {product.originalPriceINR && (
                  <span className="text-xl text-foreground/60 line-through">
                    ₹{product.originalPriceINR.toLocaleString()}
                  </span>
                )}
              </div>
              {discountPercentage && (
                <div className="text-sm font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md inline-block">
                  {discountPercentage}% OFF
                </div>
              )}
              <p className="text-sm text-foreground/70 mt-1">
                (Approx. ${product.priceUSD.toLocaleString()})
              </p>
            </CardContent>
          </Card>
          
          <Button
            size="lg"
            className={cn(
              "w-full text-lg py-3.5 text-accent-foreground cta-glow-pulse active:scale-95 transition-all duration-200",
              isAddingToCart ? "bg-green-500 hover:bg-green-600" : "bg-accent hover:bg-accent/90"
            )}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </>
            )}
          </Button>

           <Card className="glassmorphic-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Info className="h-5 w-5 text-accent"/> 
                <span>Delivery by Fitnity | Free Shipping | 30-Day Returns</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
