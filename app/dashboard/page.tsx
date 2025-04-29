"use client";

import { JSX, useState } from 'react';
// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Youtube, AlignJustify as Spotify, Bell, ChevronDown, Users } from 'lucide-react';
import { searchPodcasts } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppUtils } from '@/context/AppUtils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SearchBubbles } from '@/components/SearchBubbles';
import { PodcastCard } from '@/components/PodcastCard';
import { PodcastEpisode } from '@/types/podcast';

export default function DashboardPage() {
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PodcastEpisode[]>([]);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [adStartTime, setAdStartTime] = useState(0);
  const router = useRouter();
  const { setIsLoggedIn } = useAppUtils();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      router.push('/');
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    }
  };

  const handleSearch = async (bubbleId: string) => {
    setIsLoading(true);
    setSelectedBubble(bubbleId);
    try {
      const results = await searchPodcasts(bubbleId);
      setSearchResults(results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch podcasts. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string): JSX.Element => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'spotify':
        return <Spotify className="h-4 w-4" />;
      default:
        return <Spotify className="h-4 w-4" />;
    }
  };

  const handleListenNow = (_link: string, _platform: string) => {
    setShowAdDialog(true);
    setAdStartTime(Date.now());
  };

  const handleAdComplete = () => {
    setShowAdDialog(false);
    toast({
      title: "Enjoy your content!",
      description: "Thanks for your patience.",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Headphones className="h-6 w-6 text-primary" />
              <span className="font-bold">PodRank</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to PodRank</h1>
            <p className="text-muted-foreground">
              Discover the perfect business podcast episodes for your needs
            </p>
          </div>

          <SearchBubbles
            selectedBubble={selectedBubble}
            isLoading={isLoading}
            onBubbleClick={handleSearch}
          />

          <div className="space-y-6">
            {searchResults.map((episode) => (
              <PodcastCard
                key={episode.id}
                episode={episode}
                onListenNow={handleListenNow}
                getPlatformIcon={getPlatformIcon}
              />
            ))}
          </div>
        </main>

        <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Ad Break</DialogTitle>
              <DialogDescription>
                Your content will be ready in:
                <CountdownTimer
                  startTime={adStartTime}
                  duration={5000}
                  onComplete={handleAdComplete}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}