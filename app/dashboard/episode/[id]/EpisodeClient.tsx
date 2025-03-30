"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones, Youtube, AlignJustify as Spotify, Play, Clock, Users, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type PlatformIcon = {
  [key: string]: React.JSX.Element;
}

const platformIcons: PlatformIcon = {
  spotify: <Spotify className="h-5 w-5 text-green-500" />,
  youtube: <Youtube className="h-5 w-5 text-red-500" />
}

const highlightIcons = {
  star: <Star className="h-5 w-5" />,
  'trending-up': <TrendingUp className="h-5 w-5" />
}

const FireParticles = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 2,
  }))

  return (
    <div className="fire-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fire-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

type Episode = {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  topic: string;
  host: string;
  platform: string;
  views: string;
  releaseDate: string;
  rating: number;
  description: string;
  thumbnail: string;
  platformIcon: string;
  link: string;
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
}

type EpisodeClientProps = {
  episode: Episode;
}

export default function EpisodeClient({ episode }: EpisodeClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleListenNow = () => {
    window.open(episode.link, '_blank')
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src="https://plus.unsplash.com/premium_photo-1681488183639-f38511a647ef?q=80&w=1243&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Path to your ad image
              alt="Sponsored Content"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Advertisement - Your episode will load in a moment...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-14 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-bold">PodRank</span>
          </Link>
        </div>
      </header>

      <main className="container pt-24 pb-16">
        <div className="relative">
          <FireParticles />
          <Card className="overflow-hidden podcast-bounce">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="relative aspect-video lg:aspect-square">
                  <Image
                    src={episode.thumbnail} 
                    alt={episode.title}
                    width={1200} 
                    height={630} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-2 text-white mb-3">
                      {platformIcons[episode.platformIcon]}
                      <span>{episode.platform}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white/80 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {episode.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {episode.views} views
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-3">{episode.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{episode.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {episode.topic}
                      </span>
                      <span className="flex items-center text-yellow-500">
                        ⭐ {episode.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h2 className="font-semibold mb-4">Episode Highlights</h2>
                      <div className="grid gap-4">
                        {episode.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-primary/5">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                              {highlightIcons[highlight.icon as keyof typeof highlightIcons]}
                            </div>
                            <div>
                              <h3 className="font-medium">{highlight.title}</h3>
                              <p className="text-sm text-muted-foreground">{highlight.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="font-semibold mb-2">About the Host</h2>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{episode.host}</p>
                          <p className="text-sm text-muted-foreground">{episode.podcast}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-semibold mb-2">Release Date</h2>
                      <p className="text-muted-foreground">{episode.releaseDate}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleListenNow}
                  >
                    <Play className="h-4 w-4 mr-2" /> Listen Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}