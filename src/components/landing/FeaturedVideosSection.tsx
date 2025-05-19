
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/videos/VideoCard';
import { videos } from '@/lib/video-data';
import { ListChecks, Youtube } from 'lucide-react';

export default function FeaturedVideosSection() {
  // Select first 3-4 videos as featured
  const featuredVideos = videos.slice(0, 3); 

  if (featuredVideos.length === 0) {
    return null; // Don't render the section if there are no videos to feature
  }

  return (
    <section id="featured-videos" className="py-16 md:py-24 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
          <Youtube className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-accent mb-3 sm:mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Featured Workouts & Guides
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-foreground/80 max-w-xl sm:max-w-2xl mx-auto">
            Explore a selection of our expert-led video content to kickstart or enhance your fitness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredVideos.map((video, index) => (
            <div 
              key={video.id} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12 animate-fade-in-up" style={{ animationDelay: `${featuredVideos.length * 0.1 + 0.3}s` }}>
          <Button 
            asChild 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 cta-glow-pulse text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-3.5"
          >
            <Link href="/videos">
              View All Videos <ListChecks className="ml-2 h-4 w-4 sm:h-5 sm:w-5"/>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

