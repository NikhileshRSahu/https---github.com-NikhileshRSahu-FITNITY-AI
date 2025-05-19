
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/lib/video-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, Tag, Clock, UserCircle, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="glassmorphic-card flex flex-col h-full overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/30">
      <CardHeader className="p-0 relative">
        <Link href={`/videos/${video.id}`} passHref legacyBehavior>
          <a className="block aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={400}
              height={225}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={video.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link href={`/videos/${video.id}`} passHref legacyBehavior>
          <a>
            <CardTitle className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors duration-200 line-clamp-2">
              {video.title}
            </CardTitle>
          </a>
        </Link>
        <CardDescription className="text-xs text-card-foreground/70 mb-2 line-clamp-2 flex-grow">
          {video.description}
        </CardDescription>
        <div className="mt-auto pt-2 space-y-1 text-xs text-card-foreground/60">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" />
            <span>{video.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{video.duration}</span>
          </div>
          {video.instructor && (
            <div className="flex items-center gap-1.5">
                <UserCircle className="h-3.5 w-3.5" />
                <span>{video.instructor}</span>
            </div>
          )}
          {video.level && (
            <div className="flex items-center gap-1.5">
                <BarChart className="h-3.5 w-3.5 transform -rotate-90" /> 
                <span>{video.level}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button
          variant="outline"
          className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground active:scale-95 transition-all duration-200"
          asChild
        >
          <Link href={`/videos/${video.id}`}>
            <PlayCircle className="mr-2 h-4 w-4" /> Watch Video
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
