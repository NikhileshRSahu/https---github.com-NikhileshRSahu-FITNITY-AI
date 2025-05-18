
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/lib/product-data';
import { ShoppingBag, ListChecks, Tag, Zap, Shirt, Apple, Watch, Dumbbell } from 'lucide-react'; 
import type { LucideIcon } from 'lucide-react';

export default function ShopPage() {
  const featuredProducts = products.slice(0, 3); 
  
  type CategoryWithIcon = {
    name: string;
    icon: LucideIcon;
    slug: string;
  };

  const categories: CategoryWithIcon[] = [
    { name: 'Equipment', icon: Dumbbell, slug: 'equipment' },
    { name: 'Apparel', icon: Shirt, slug: 'apparel' },
    { name: 'Nutrition', icon: Apple, slug: 'nutrition' },
    { name: 'Wearables', icon: Watch, slug: 'wearables' },
    { name: 'Accessories', icon: Zap, slug: 'accessories' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <header className="text-center mb-12 sm:mb-16">
        <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-accent mb-3 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
          Welcome to the Fitnity AI Store
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-xl sm:max-w-2xl mx-auto">
          Discover AI-curated fitness gear, apparel, and nutrition to supercharge your journey with Fitnity AI.
        </p>
      </header>

      <section id="featured-products" className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 sm:gap-3">
            <Tag className="h-6 w-6 sm:h-7 sm:w-7 text-accent"/> Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-12">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 cta-glow-pulse text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-3.5">
            <Link href="/shop/products">
              View All Products <ListChecks className="ml-2 h-4 w-4 sm:h-5 sm:w-5"/>
            </Link>
          </Button>
        </div>
      </section>

      <section id="shop-by-category" className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 sm:mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop/products?category=${category.slug}`}
              className="block p-4 sm:p-6 glassmorphic-card rounded-lg text-center hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <category.icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent mx-auto mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-sm sm:text-lg font-medium text-card-foreground group-hover:text-accent transition-colors duration-300">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section id="ai-recommendations" className="text-center py-10 sm:py-12 border-t border-b border-border/20 my-12 sm:my-16">
         <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 sm:mb-4">AI Picks For You</h2>
         <p className="text-foreground/70 mb-4 sm:mb-6 text-sm sm:text-base">Coming soon: Products recommended by Fitnity AI based on your profile and goals!</p>
         <div className="h-32 sm:h-40 bg-background/10 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic text-sm sm:text-base">AI Recommendation Area</p>
         </div>
      </section>
    </div>
  );
}
