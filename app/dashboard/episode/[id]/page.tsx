import EpisodeClient from './EpisodeClient'

// Mock data for static generation
const EPISODES = [
  {
    id: '1',
    title: "The Psychology of Success",
    podcast: "Mind Matters",
    duration: "45 min",
    topic: "Motivation & Leadership",
    host: "Dr. Emily Carter",
    platform: "Spotify",
    views: "250K",
    releaseDate: "2024-04-10",
    rating: 4.8,
    description: "Unlock the mindset secrets of top performers and learn how to apply proven psychological principles to achieve extraordinary success in your business and personal life.",
    thumbnail: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&auto=format&fit=crop&q=60",
    platformIcon: "spotify",
    link: "https://open.spotify.com/episode/0Q6pE6DfdJ0ZQZbPTVvxzW",
    highlights: [
      {
        icon: "star",
        title: "Peak Performance",
        description: "Learn the psychological techniques used by top performers"
      },
      {
        icon: "trending-up",
        title: "Growth Mindset",
        description: "Develop resilience and adaptability in challenging situations"
      }
    ]
  }
]

export function generateStaticParams() {
  return EPISODES.map((episode) => ({
    id: episode.id,
  }))
}

export default function EpisodePage() {
  const episode = EPISODES[0]
  return <EpisodeClient episode={episode} />
}