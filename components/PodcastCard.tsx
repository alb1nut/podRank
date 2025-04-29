"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Users } from 'lucide-react';
import Image from 'next/image';
import customLoader from '@/lib/imageLoader';
import { PodcastEpisode } from '@/types/podcast';
import { JSX } from "react";

interface PodcastCardProps {
  episode: PodcastEpisode;
  onListenNow: (link: string, platform: string) => void;
  getPlatformIcon: (platform: string) => JSX.Element;
}

export function PodcastCard({ episode, onListenNow, getPlatformIcon }: PodcastCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-20 blur-3xl"></div>
      <Card className="relative overflow-hidden backdrop-blur-sm border-0 bg-white/80">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
              <Image 
                src={`https://i.ytimg.com/vi/${episode.id}/hqdefault.jpg`}
                alt={episode.title}
                width={1200} 
                height={630} 
                className="w-full h-full object-cover"
                loader={customLoader}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-podcast.jpg';
                }}
                unoptimized
              />
              <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/40 rounded-full px-3 py-1 text-white">
                {getPlatformIcon(episode.platform)}
                <span className="text-sm">{episode.platform}</span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-white/95 to-white/50">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {episode.topic}
                  </span>
                  <span className="flex items-center text-yellow-500">
                    ⭐ {episode.rating}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{episode.title}</h3>
                <p className="text-muted-foreground mb-6">{episode.description}</p>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Publisher</p>
                    <p className="font-medium">{episode.publisher}</p>
                  </div>
                </div>
              </div>
              <Button 
                className="mt-6 bg-primary hover:bg-primary/90 w-full"
                onClick={() => onListenNow(episode.link, episode.platform)}
              >
                <Play className="h-4 w-4 mr-2" /> Listen Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}