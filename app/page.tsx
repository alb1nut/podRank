import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Headphones, ArrowRight, TrendingUp, Clock, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-bold">PodRank</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/dashboard">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container flex min-h-screen flex-col items-center justify-center space-y-8 py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Find the perfect business podcast episode in seconds
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            PodRank helps busy professionals discover the most relevant business content
            based on their specific needs and interests.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-4 bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

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