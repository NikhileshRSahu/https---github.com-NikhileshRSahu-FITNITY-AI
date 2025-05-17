
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/lib/product-data';
import { ShoppingBag, ListChecks, Tag } from 'lucide-react';

export default function ShopPage() {
  const featuredProducts = products.slice(0, 3); // Show first 3 as featured
  const categories = ['Equipment', 'Apparel', 'Nutrition', 'Wearables', 'Accessories'];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <header className="text-center mb-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-accent mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to the Fitnity AI Store
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Discover AI-curated fitness gear, apparel, and nutrition to supercharge your journey with Fitnity AI.
        </p>
      </header>

      {/* Featured Products Section */}
      <section id="featured-products" className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Tag className="h-7 w-7 text-accent"/> Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 cta-glow-pulse">
            <Link href="/shop/products">
              View All Products <ListChecks className="ml-2 h-5 w-5"/>
            </Link>
          </Button>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section id="shop-by-category" className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/shop/products?category=${category.toLowerCase()}`} // Placeholder for actual filtering
              className="block p-6 glassmorphic-card rounded-lg text-center hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-medium text-card-foreground group-hover:text-accent">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Placeholder for AI Recommendations */}
      <section id="ai-recommendations" className="text-center py-12 border-t border-b border-border/20 my-16">
         <h2 className="text-3xl font-semibold text-foreground mb-4">AI Picks For You</h2>
         <p className="text-foreground/70 mb-6">Coming soon: Products recommended by Fitnity AI based on your profile and goals!</p>
         <div className="h-40 bg-background/10 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic">AI Recommendation Area</p>
         </div>
      </section>
    </div>
  );
}
