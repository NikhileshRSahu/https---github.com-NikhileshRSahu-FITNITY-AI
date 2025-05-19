
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
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams, selectedCategory]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES_SLUG || product.category.toLowerCase() === selectedCategory;
      const matchesSearch = 
        searchTerm.trim() === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);
  
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (categorySlug === ALL_CATEGORIES_SLUG) {
      current.delete('category');
    } else {
      current.set('category', categorySlug);
    }
    const query = current.toString();
    // Using window.history.pushState to avoid full page reload if preferred
    // For Next.js App Router, usually navigation via Link or router.push is preferred for prefetching etc.
    // But for simple query param changes without full navigation, this is okay.
    window.history.pushState({}, '', query ? `?${query}` : '/shop/products');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <header className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
        <LayoutGrid className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-accent mb-3 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
          Our Gear & Nutrition
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-lg sm:max-w-xl mx-auto">
          Everything you need to complement your Fitnity AI experience and achieve your fitness goals.
        </p>
      </header>

      <Card className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-center">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base bg-background/30 border-border/50 text-card-foreground placeholder:text-card-foreground/60 focus:ring-accent focus:border-accent h-10 sm:h-12"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm('')}
              >
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 md:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 sm:mb-3 flex items-center">
            <Filter className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Categories
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {uniqueCategories.map(categorySlug => (
              <Button
                key={categorySlug}
                variant={selectedCategory === categorySlug ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(categorySlug)}
                className={cn(
                  "capitalize text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto transition-all duration-200",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.05 + 0.5}s`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <Alert className="glassmorphic-card text-center py-8 sm:py-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <XCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-destructive mb-3 sm:mb-4" />
          <AlertTitle className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">No Products Found</AlertTitle>
          <AlertDescription className="text-base sm:text-lg">
            Try adjusting your search or category filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

    