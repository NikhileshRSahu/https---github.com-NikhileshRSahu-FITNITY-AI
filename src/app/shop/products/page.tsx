
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/lib/product-data';
import { Filter, LayoutGrid } from 'lucide-react';

export default function AllProductsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <header className="text-center mb-12 md:mb-16">
        <LayoutGrid className="mx-auto h-16 w-16 text-accent mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          Our Gear & Nutrition
        </h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          Everything you need to complement your Fitnity AI experience and achieve your fitness goals.
        </p>
      </header>

      {/* Placeholder for Filters & Sorting - Future Enhancement */}
      <div className="mb-8 p-4 glassmorphic-card rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-card-foreground flex items-center">
          <Filter className="mr-2 h-5 w-5 text-accent" /> Filters
        </h2>
        <div className="flex gap-2">
            <p className="text-sm text-card-foreground/70 italic">(Filter options coming soon)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
