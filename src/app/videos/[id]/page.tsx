
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { videos, type Video } from '@/lib/video-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlayCircle, Tag, Clock, UserCircle, BarChart, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image'; // Import next/image

export default function VideoDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [video, setVideo] = useState<Video | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const foundVideo = videos.find(v => v.id === id);
      setVideo(foundVideo || null);
    } else {
      setVideo(null); // If no id, explicitly set to null
    }
  }, [id]);

  if (video === undefined) { // Initial loading state
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-16">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-8 w-40 bg-muted/50" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="md:col-span-2">
            <Skeleton className="w-full aspect-video rounded-xl bg-muted/50 mb-6" />
            <Skeleton className="h-10 w-3/4 sm:h-12 mb-3 bg-muted/50" />
            <Skeleton className="h-20 w-full sm:h-24 bg-muted/50" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-48 w-full bg-muted/50" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 text-center min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center animate-fade-in-up">
        <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold text-destructive mb-4">Video Not Found</h1>
        <p className="text-foreground/70 mb-6">Sorry, we couldn't find the video you were looking for.</p>
        <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground">
          <Link href="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Videos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-16 animate-fade-in-up">
      <div className="mb-6 sm:mb-8">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 transition-all duration-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 h-auto">
          <Link href="/videos">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to All Videos
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
        <div className="md:col-span-2">
          <Card className="glassmorphic-card overflow-hidden mb-6 sm:mb-8">
            <div className="aspect-video bg-background/30 flex items-center justify-center text-muted-foreground rounded-t-lg border-b border-border/20">
              {/* Placeholder for actual video player. For now, we can show the thumbnail. */}
              <Image 
                src={video.thumbnailUrl} 
                alt={`Thumbnail for ${video.title}`}
                width={1280} 
                height={720} 
                className="object-cover w-full h-full"
                data-ai-hint={video.aiHint} 
              />
              {/* <PlayCircle className="h-24 w-24 text-accent/50" />
              <p className="mt-2 text-lg">Video Player Placeholder</p> */}
            </div>
          </Card>
          <Card className="glassmorphic-card">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {video.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="glassmorphic-card p-4 sm:p-6 sticky top-20 md:top-24">
            <CardTitle className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">Video Details</CardTitle>
            <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-foreground/80">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                <strong>Category:</strong> {video.category}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <strong>Duration:</strong> {video.duration}
              </div>
              {video.instructor && (
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-accent" />
                  <strong>Instructor:</strong> {video.instructor}
                </div>
              )}
              {video.level && (
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-accent transform -rotate-90" />
                  <strong>Level:</strong> {video.level}
                </div>
              )}
            </div>
            <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse text-base sm:text-lg" onClick={() => alert(`Playing: ${video.title} (Placeholder)`)}>
              <PlayCircle className="mr-2 h-5 w-5" /> Play Video
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
