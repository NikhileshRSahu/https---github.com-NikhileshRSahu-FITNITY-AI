
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import VideoCard from '@/components/videos/VideoCard';
import { videos, videoCategories, type VideoCategory } from '@/lib/video-data';
import { Filter, Search, XCircle, Youtube, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES_SLUG = 'all';

function VideosPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category')?.toLowerCase() || ALL_CATEGORIES_SLUG;
  const initialSearchTerm = searchParams.get('search') || '';


  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')?.toLowerCase() || ALL_CATEGORIES_SLUG;
    const searchFromUrl = searchParams.get('search') || '';
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams, selectedCategory, searchTerm]);

  const normalizedCategories = useMemo(() => {
    return [ALL_CATEGORIES_SLUG, ...videoCategories.map(cat => cat.toLowerCase())];
  }, []);

  const filteredVideos = useMemo(() => {
    if (videos.length === 0) {
      return [];
    }
    return videos.filter(video => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES_SLUG || video.category.toLowerCase() === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.instructor && video.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const updateQueryParams = (newCategory?: string, newSearchTerm?: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newCategory !== undefined) {
      if (newCategory === ALL_CATEGORIES_SLUG) {
        current.delete('category');
      } else {
        current.set('category', newCategory);
      }
    }
    if (newSearchTerm !== undefined) {
      if (newSearchTerm.trim() === '') {
        current.delete('search');
      } else {
        current.set('search', newSearchTerm);
      }
    }
    const query = current.toString();
    router.push(query ? `/videos?${query}` : '/videos');
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    updateQueryParams(categorySlug, searchTerm);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Debounce this in a real app
    updateQueryParams(selectedCategory, newSearchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateQueryParams(selectedCategory, '');
  };
  
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  if (videos.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] animate-fade-in-up">
        <Film className="h-20 w-20 sm:h-24 sm:w-24 text-muted-foreground mb-6 sm:mb-8" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-5">Our Video Library is Empty</h1>
        <p className="text-foreground/70 mb-8 sm:mb-10 max-w-md text-base sm:text-lg">
          We're preparing amazing workout videos and guides. Please check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <header className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
        <Youtube className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-primary dark:text-accent mb-3 sm:mb-4" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
          Fitnity Video Library
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-lg sm:max-w-xl mx-auto">
          Explore expert-led workout videos, yoga sessions, meditation guides, and more to elevate your fitness journey.
        </p>
      </header>

      <Card className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 glassmorphic-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-center">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search videos by title, description, or instructor..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-12"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
              >
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 md:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 sm:mb-3 flex items-center">
            <Filter className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-accent" /> Categories
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {normalizedCategories.map(categorySlug => (
              <Button
                key={categorySlug}
                variant={selectedCategory === categorySlug ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(categorySlug)}
                className={cn(
                  "capitalize text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto transition-all duration-200",
                  selectedCategory === categorySlug
                  ? "bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground"
                  : "border-primary dark:border-accent text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary-foreground dark:hover:text-accent-foreground"
                )}
              >
                {capitalizeFirstLetter(categorySlug.replace('-', ' '))}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {filteredVideos.map((video, index) => (
            <div key={video.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05 + 0.5}s` }}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      ) : (
        <Alert className="glassmorphic-card text-center py-8 sm:py-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <XCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-destructive mb-3 sm:mb-4" />
          <AlertTitle className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">No Videos Found</AlertTitle>
          <AlertDescription className="text-base sm:text-lg">
            Try adjusting your search or category filters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    // Suspense can be useful here if VideoPageContent itself had async data fetching
    // For now, since data is local, direct render is fine.
    // Using Suspense for good practice if this component were to fetch data later.
    <Suspense fallback={<div>Loading videos...</div>}>
      <VideosPageContent />
    </Suspense>
  );
}
