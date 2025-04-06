"use client"; 
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Headphones, ArrowRight, TrendingUp, Star, Users, Award, Play,  Clock, Target } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { useState } from 'react'
import customLoader from '@/lib/imageLoader';

const PREVIEW_BUBBLES = [
  { 
    id: 'motivation',
    label: 'Need Motivation', 
    color: 'bg-blue-500', 
    icon: <Star className="w-4 h-4" />
  },
  { 
    id: 'startup',
    label: 'Starting a Business', 
    color: 'bg-green-500', 
    icon: <TrendingUp className="w-4 h-4" />
  },
  { 
    id: 'leadership',
    label: 'Leadership Skills', 
    color: 'bg-orange-500', 
    icon: <Users className="w-4 h-4" />
  },
]

const DEMO_PODCASTS = [
  {
    id: 1,
    title: "The Psychology of Success",
    host: "Dr. Emily Carter",
    thumbnail: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&auto=format&fit=crop&q=60",
    description: "Unlock the mindset secrets of top performers",
    platform: "Spotify",
    rating: 4.8
  },
  {
    id: 2,
    title: "Future of Work Trends",
    host: "Alex Rivera",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    description: "Navigating the evolving workplace landscape",
    platform: "YouTube",
    rating: 4.5
  }
]

export default function Home() {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showDemoResults, setShowDemoResults] = useState(false)

  const handleBubbleClick = (bubbleId: string) => {
    setSelectedBubble(bubbleId)
    setShowDemoResults(true)
  }

  const handleListenClick = () => {
    setShowSignupModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed header with proper centering */}
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="flex items-center space-x-2"> {/* Fixed typo: space-x-2 instead of space-x-2 */}
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-bold">PodRank</span>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <Link href="/dashboard">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content with proper centering */}
      <main className="container mx-auto flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-24">
        {!showDemoResults ? (
          <div className="w-full max-w-[980px] mx-auto flex flex-col items-center gap-8 text-center">
            {/* Hero section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                Find the perfect business podcast episode in seconds
              </h1>
              <p className="max-w-[750px] mx-auto text-lg text-muted-foreground sm:text-xl">
                PodRank helps busy professionals discover the most relevant business content
                based on their specific needs and interests.
              </p>
            </div>
            
            {/* Interactive preview section */}
            <div className="w-full max-w-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
              <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border shadow-xl">
                <h2 className="text-xl font-semibold mb-6">How would you like to grow today?</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {PREVIEW_BUBBLES.map((bubble) => (
                    <button
                      key={bubble.id}
                      onClick={() => handleBubbleClick(bubble.id)}
                      className={`px-6 py-3 rounded-full ${bubble.color} text-white flex items-center space-x-2 transform hover:scale-105 transition-transform cursor-pointer`}
                    >
                      {bubble.icon}
                      <span>{bubble.label}</span>
                    </button>
                  ))}
                </div>
                <div className="bg-primary/5 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">AI-Powered Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll find the perfect episode based on your selection
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Value propositions - now properly centered */}
            <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* ... your value prop cards ... */}
            </div>
          </div>
        ) : (
          /* Demo results section - now properly centered */
          <div className="w-full max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              Here&apos;s what we found for &quot;{PREVIEW_BUBBLES.find(b => b.id === selectedBubble)?.label}&quot;
            </h2>
            
            {DEMO_PODCASTS.map((podcast) => (
              <div key={podcast.id} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-20 blur-3xl" />
                <div className="relative overflow-hidden backdrop-blur-sm border-0 bg-white/80 rounded-xl">
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent z-10" />
                      <Image 
                        loader={customLoader}
                        src={podcast.thumbnail} 
                        alt={podcast.title}
                        width={1200} 
                        height={630} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {PREVIEW_BUBBLES.find(b => b.id === selectedBubble)?.label}
                          </span>
                          <span className="flex items-center text-yellow-500">
                            ⭐ {podcast.rating}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{podcast.title}</h3>
                        <p className="text-muted-foreground mb-6">{podcast.description}</p>
                      </div>
                      <Button 
                        className="mt-6 bg-primary hover:bg-primary/90 w-full"
                        onClick={handleListenClick}
                      >
                        <Play className="h-4 w-4 mr-2" /> Listen Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowDemoResults(false)}
                className="mr-4"
              >
                Back to Categories
              </Button>
              <Link href="/dashboard">
                <Button>
                  Sign Up for Full Access
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Signup Modal */}
        <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ready to listen?</DialogTitle>
              <DialogDescription>
                Sign up to access this podcast and thousands more
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  Sign Up Now
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account? <Link href="/dashboard" className="text-primary">Sign in</Link>
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Trending Topics</h3>
            <p className="text-muted-foreground">
              Stay updated with the latest business trends and insights
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Save Time</h3>
            <p className="text-muted-foreground">
              Find relevant content quickly without endless searching
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Personalized Recommendations</h3>
            <p className="text-muted-foreground">
              Get episode suggestions based on your mood and needs
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}