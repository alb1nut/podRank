"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones, Youtube, AlignJustify as Spotify, TrendingUp, Clock, Star, Play, Users, Award, Bell, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { searchPodcasts } from '@/lib/api'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  platform: string;
  topic: string;
  rating: number;
  publisher: string;
  link: string;
}

interface PodRankPick {
  id: number;
  title: string;
  host: string;
  thumbnail: string;
  description: string;
  platform: string;
  platformIcon: React.ReactNode;
  isSponsored?: boolean;
}

const WEEKLY_THEMES = {
  Monday: { name: "Motivation Monday", color: "bg-blue-500" },
  Sunday: { name: "Startup Sunday", color: "bg-green-500" },
  Friday: { name: "Finance Friday", color: "bg-yellow-500" }
}

const SEARCH_BUBBLES = [
  { 
    id: 'motivation', 
    label: 'Need Motivation', 
    delay: '0s', 
    color: 'bg-blue-500 hover:bg-blue-600', 
    icon: <Star className="w-4 h-4 mr-2" />
  },
  { 
    id: 'startup', 
    label: 'Starting a Business', 
    delay: '0.1s', 
    color: 'bg-green-500 hover:bg-green-600', 
    icon: <TrendingUp className="w-4 h-4 mr-2" />
  },
  { 
    id: 'ai', 
    label: 'AI & Tech Trends', 
    delay: '0.2s', 
    color: 'bg-purple-500 hover:bg-purple-600', 
    icon: <Clock className="w-4 h-4 mr-2" />
  },
  { 
    id: 'leadership', 
    label: 'Leadership Skills', 
    delay: '0.3s', 
    color: 'bg-orange-500 hover:bg-orange-600', 
    icon: <Users className="w-4 h-4 mr-2" />
  },
  { 
    id: 'productivity', 
    label: 'Boost Productivity', 
    delay: '0.4s', 
    color: 'bg-pink-500 hover:bg-pink-600', 
    icon: <Award className="w-4 h-4 mr-2" />
  }
]

const PODRANK_PICKS: PodRankPick[] = [
  {
    id: 1,
    title: "The Psychology of Success",
    host: "Dr. Emily Carter",
    thumbnail: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&auto=format&fit=crop&q=60",
    description: "Unlock the mindset secrets of top performers",
    platform: "Spotify",
    platformIcon: <Spotify className="h-4 w-4 text-green-500" />,
    isSponsored: true
  },
  {
    id: 2,
    title: "Future of Work Trends",
    host: "Alex Rivera",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    description: "Navigating the evolving workplace landscape",
    platform: "YouTube",
    platformIcon: <Youtube className="h-4 w-4 text-red-500" />,
  },
  {
    id: 3,
    title: "Scaling Your Business",
    host: "Sarah Chen",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    description: "Growth strategies from successful entrepreneurs",
    platform: "Spotify",
    platformIcon: <Spotify className="h-4 w-4 text-green-500" />,
  }
]

const AFFILIATE_BASE_URLS = {
  spotify: "https://open.spotify.com/show/",
  youtube: "https://www.youtube.com/watch?v="
}

export default function DashboardPage() {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAd, setShowAd] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [email, setEmail] = useState("")
  const [canSkipAd, setCanSkipAd] = useState(false)
  const adTimer = useRef<NodeJS.Timeout | null>(null)
  const skipTimer = useRef<NodeJS.Timeout | null>(null)
  const forceAdMinTime = useRef(true)
  const adStartTime = useRef<number>(0)
  const [currentTheme, setCurrentTheme] = useState<string>("")

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-us', { weekday: 'long' });
    const dayName = today.split(',')[0];
    setCurrentTheme(WEEKLY_THEMES[dayName as keyof typeof WEEKLY_THEMES]?.name || "");
  }, [])

  const handleBubbleClick = async (bubbleId: string) => {
    adStartTime.current = Date.now()
    setSelectedBubble(bubbleId)
    setIsLoading(true)
    setShowAd(true)
    setCanSkipAd(false)
    setError(null)
    forceAdMinTime.current = true

    // Set timer for skip button to appear after 5 seconds
    skipTimer.current = setTimeout(() => {
      setCanSkipAd(true)
    }, 5000)

    // Set timer for auto-close after 15 seconds
    adTimer.current = setTimeout(() => {
      setShowAd(false)
    }, 15000)

    try {
      const results = await searchPodcasts(bubbleId)
      setEpisodes(results)
    } catch (err) {
      setError('Failed to fetch podcasts. Please try again.')
      console.error('Error fetching podcasts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (adTimer.current) clearTimeout(adTimer.current)
      if (skipTimer.current) clearTimeout(skipTimer.current)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!localStorage.getItem('emailCaptured')) {
        setShowEmailCapture(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    localStorage.setItem('emailCaptured', 'true')
    setShowEmailCapture(false)
  }

  const handleListenNow = (link: string, platform: string) => {
    // Add affiliate tracking parameters
    const affiliateLink = `${AFFILIATE_BASE_URLS[platform.toLowerCase() as keyof typeof AFFILIATE_BASE_URLS]}${link}?ref=podrank`
    window.open(affiliateLink, '_blank')
  }

  const getPlatformIcon = (platform: string) => {
    return platform.toLowerCase() === 'spotify' 
      ? <Spotify className="h-5 w-5 text-green-500" />
      : <Youtube className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-bold">PodRank</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-sm" onClick={() => setShowEmailCapture(true)}>
              <Bell className="h-4 w-4 mr-2" />
              Get Notified
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex items-center">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Guest</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/auth" className="flex items-center">
                    Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEmailCapture(true)}>
                  Get Weekly Updates
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {currentTheme && (
        <div className={`w-full py-2 text-center text-white ${WEEKLY_THEMES[currentTheme.split(' ')[0] as keyof typeof WEEKLY_THEMES]?.color}`}>
          {currentTheme} - Discover Today&apos;s Special Picks! 🎧
        </div>
      )}

      {showAd && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in">
            <div className="relative aspect-video bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&auto=format&fit=crop&q=60"
                alt="Sponsored Content"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-white text-sm font-medium">Finding your perfect podcast...</span>
                <span className="text-white text-sm block mt-1">
                  {Math.max(0, Math.ceil((15000 - (Date.now() - adStartTime.current)) / 1000))}s
                </span>
              </div>
              {canSkipAd && (
                <Button
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setShowAd(false)}
                >
                  Skip Ad
                </Button>
              )}
            </div>
            <div className="p-6 text-center space-y-4">
              <h3 className="text-xl font-bold">Download Our Business Podcast Cheat Sheet</h3>
              <p className="text-muted-foreground">
                Get our curated list of top business podcasts while we find your perfect match!
              </p>
              <Button className="w-full">Download Now</Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showEmailCapture} onOpenChange={setShowEmailCapture}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Want the top business podcast pick in your inbox every Monday?</DialogTitle>
            <DialogDescription>
              Join thousands of professionals getting weekly podcast recommendations
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Get Weekly Updates</Button>
          </form>
        </DialogContent>
      </Dialog>

      {!showAd && (
        <div className="container mx-auto pt-20 pb-10 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">What are you looking for today?</h1>
                <p className="text-muted-foreground">Select your current need and we&apos;ll find the perfect episode for you</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {SEARCH_BUBBLES.map((bubble) => (
                  <Button
                    key={bubble.id}
                    className={`bubble-button text-white ${bubble.color} ${
                      selectedBubble === bubble.id ? 'ring-4 ring-offset-2' : ''
                    }`}
                    style={{ '--delay': bubble.delay } as React.CSSProperties}
                    onClick={() => handleBubbleClick(bubble.id)}
                    disabled={isLoading}
                  >
                    {bubble.icon}
                    {bubble.label}
                  </Button>
                ))}
              </div>

              <div className="text-center mb-8">
                <Button variant="outline" onClick={() => setShowEmailCapture(true)}>
                  Get a weekly podcast prescription →
                </Button>
              </div>

              {error && (
                <div className="text-center text-red-500 mt-8">
                  {error}
                </div>
              )}

              {!isLoading && !error && episodes.length > 0 && (
                <div className="space-y-6">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-20 blur-3xl"></div>
                      <Card className="relative overflow-hidden backdrop-blur-sm border-0 bg-white/80">
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-2">
                            <div className="relative aspect-video">
                              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10"></div>
                              <Image 
                                src={episode.thumbnail} 
                                alt={episode.title}
                                width={1200} 
                                height={630} 
                                className="w-full h-full object-cover"
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
                                onClick={() => handleListenNow(episode.link, episode.platform)}
                              >
                                <Play className="h-4 w-4 mr-2" /> Listen Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && !error && selectedBubble && episodes.length === 0 && (
                <div className="text-center text-muted-foreground mt-8">
                  No podcasts found for your selection. Try another category!
                </div>
              )}

              {!selectedBubble && !isLoading && (
                <div className="text-center text-muted-foreground mt-8">
                  👆 Select what you&apos;re looking for above to get started
                </div>
              )}
            </main>

            <aside className="w-full lg:w-80 shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center space-x-2 mb-6">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">PodRank&apos;s Pick 🎧</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {PODRANK_PICKS.map((pick) => (
                    <Link href={`/episode/${pick.id}`} key={pick.id}>
                      <Card className={`group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:shadow-lg h-full ${
                        pick.isSponsored ? 'border-2 border-primary' : ''
                      }`}>
                        <CardContent className="p-4">
                          {pick.isSponsored && (
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                              Sponsored
                            </span>
                          )}
                          <div className="relative aspect-[16/9] rounded-md overflow-hidden mb-3">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                            <Image
                              src={pick.thumbnail} 
                              alt={pick.title}
                              width={1200} 
                              height={630} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/40 rounded-full px-2 py-0.5">
                              {pick.platformIcon}
                              <span className="text-xs text-white">{pick.platform}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                            {pick.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{pick.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {pick.host}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  )
}