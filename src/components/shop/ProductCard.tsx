
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/product-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: `${product.name} added to cart! (Demo)`,
      description: "This is a demo. Cart functionality is not yet implemented.",
    });
  };

  return (
    <Card className="glassmorphic-card flex flex-col h-full overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/30">
      <CardHeader className="p-0 relative">
        <Link href={`/shop/products/${product.slug}`} passHref legacyBehavior>
          <a className="block aspect-square overflow-hidden">
            <Image
              src={product.imagePlaceholder}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={product.aiHint}
            />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link href={`/shop/products/${product.slug}`} passHref legacyBehavior>
          <a>
            <CardTitle className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-200 truncate">
              {product.name}
            </CardTitle>
          </a>
        </Link>
        <p className="text-sm text-card-foreground/70 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
            <p className="text-xl font-bold text-accent">₹{product.priceINR.toLocaleString()}</p>
            {product.originalPriceINR && (
              <p className="text-sm text-card-foreground/60 line-through">₹{(product.originalPriceINR).toLocaleString()}</p> 
            )}
        </div>
         <p className="text-xs text-card-foreground/50 mb-2">Approx. ${product.priceUSD}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto flex-grow border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 transition-all duration-200"
          asChild
        >
          <Link href={`/shop/products/${product.slug}`}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
        <Button 
          className="w-full sm:w-auto flex-grow bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 transition-all duration-200 text-sm py-2.5 px-4"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
