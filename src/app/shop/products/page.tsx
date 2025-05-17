
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { products, type Product } from '@/lib/product-data';
import { Filter, LayoutGrid, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES_SLUG = 'all';

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || ALL_CATEGORIES_SLUG;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category.toLowerCase()));
    return [ALL_CATEGORIES_SLUG, ...Array.from(categories)];
  }, []);
  
  useEffect(() => {
    // If category changes via URL, update state
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
     // If no category in URL, default to "all" (or keep current selection if already set)
    if (!categoryFromUrl && selectedCategory !== ALL_CATEGORIES_SLUG) {
      // This might be too aggressive if user manually clears category then searches.
      // Consider if this behavior is desired. For now, it ensures URL param drives initial state.
      // setSelectedCategory(ALL_CATEGORIES_SLUG); 
    }
  }, [searchParams, selectedCategory]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES_SLUG || product.category.toLowerCase() === selectedCategory;
      const matchesSearch = 
        searchTerm.trim() === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);
  
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    // Update URL without full page reload (optional, good for UX)
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (categorySlug === ALL_CATEGORIES_SLUG) {
      current.delete('category');
    } else {
      current.set('category', categorySlug);
    }
    const query = current.toString();
    // Using window.history.pushState for client-side URL update without navigation
    // Next.js router.replace could also be used here.
    window.history.pushState({}, '', query ? `?${query}` : '/shop/products');
  };

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

      <Card className="mb-8 p-4 md:p-6 glassmorphic-card">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-3 text-base bg-background/30 border-border/50 text-card-foreground placeholder:text-card-foreground/60 focus:ring-accent focus:border-accent"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm('')}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 md:mt-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-accent" /> Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {uniqueCategories.map(categorySlug => (
              <Button
                key={categorySlug}
                variant={selectedCategory === categorySlug ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(categorySlug)}
                className={cn(
                  "capitalize text-sm px-4 py-2 h-auto transition-all duration-200",
                  selectedCategory === categorySlug
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                    : "border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground"
                )}
              >
                {categorySlug.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Alert className="glassmorphic-card text-center py-10">
          <AlertTitle className="text-2xl font-semibold mb-2">No Products Found</AlertTitle>
          <AlertDescription className="text-lg">
            Try adjusting your search or category filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
