"use client";

import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Clock, Users, Award } from 'lucide-react';

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
];

interface SearchBubblesProps {
  selectedBubble: string | null;
  isLoading: boolean;
  onBubbleClick: (bubbleId: string) => void;
}

export function SearchBubbles({ selectedBubble, isLoading, onBubbleClick }: SearchBubblesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {SEARCH_BUBBLES.map((bubble) => (
        <Button
          key={bubble.id}
          className={`bubble-button text-white ${bubble.color} ${
            selectedBubble === bubble.id ? 'ring-4 ring-offset-2' : ''
          }`}
          style={{ '--delay': bubble.delay } as React.CSSProperties}
          onClick={() => onBubbleClick(bubble.id)}
          disabled={isLoading}
        >
          {bubble.icon}
          {bubble.label}
        </Button>
      ))}
    </div>
  );
}