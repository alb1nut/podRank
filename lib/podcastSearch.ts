// Category-specific keywords mapping
const CATEGORY_KEYWORDS = {
    motivation: ['motivation', 'inspiration', 'mindset'],
    startup: ['startup', 'entrepreneurship', 'business'],
    ai: ['artificial intelligence', 'technology', 'innovation'],
    leadership: ['leadership', 'management', 'team building'],
    productivity: ['productivity', 'time management', 'efficiency'],
  };
  
//   interface SpotifyImage {
//     url: string;
//     height: number;
//     width: number;
//   }
  
//   interface SpotifyShow {
//     publisher?: string;
//   }
  
//   interface SpotifyEpisode {
//     id: string;
//     name?: string;
//     description?: string;
//     images?: SpotifyImage[];
//     show?: SpotifyShow;
//     external_urls?: {
//       spotify?: string;
//     };
//   }
  
//   interface SpotifySearchResponse {
//     episodes?: {
//       items?: SpotifyEpisode[];
//     };
//   }
  
  interface YouTubeSearchItem {
    id?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
      description?: string;
      thumbnails?: {
        high?: {
          url?: string;
        };
      };
      channelTitle?: string;
    };
  }
  
  interface YouTubeSearchResponse {
    items?: YouTubeSearchItem[];
  }
  
  interface PodcastEpisode {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    platform: 'YouTube' | 'Spotify';
    platformIcon: 'youtube' | 'spotify';
    topic: string;
    rating: number;
    publisher: string;
    link: string;
  }
  
  export async function searchPodcasts(category: string): Promise<PodcastEpisode[]> {
    try {
      const keywords = CATEGORY_KEYWORDS[category as keyof typeof CATEGORY_KEYWORDS] || [category];
      const query = keywords.join(' ');
  
    //   // Try both services and combine results
    //   const [spotifyResults, youtubeResults] = await Promise.all([
    //     searchSpotify(query).catch(() => [] as PodcastEpisode[]),
    //     searchYouTube(query).catch(() => [] as PodcastEpisode[]),
    //   ]);

  
    //   // Filter out invalid entries and randomize
    //   const validResults = [...spotifyResults, ...youtubeResults]
    //     .filter(episode => episode.id && episode.title && episode.thumbnail)
    //     .sort(() => Math.random() - 0.5)
    //     .slice(0, 5);

        // Only search YouTube (removed Spotify)
        const youtubeResults = await searchYouTube(query).catch(() => [] as PodcastEpisode[]);

        // Filter and randomize YouTube results only
        const validResults = youtubeResults
          .filter(episode => episode.id && episode.title && episode.thumbnail)
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
  
      return validResults.length > 0 
        ? validResults 
        : [createFallbackEpisode(query)];
  
    } catch (error) {
      console.error('Search failed:', error);
      return [createFallbackEpisode(category)];
    }
  }
  
  function createFallbackEpisode(query: string): PodcastEpisode {
    return {
      id: 'fallback-' + Math.random().toString(36).substring(2, 9),
      title: 'Could not load podcasts',
      description: 'Try another search term or check back later',
      thumbnail: '/default-podcast.jpg',
      platform: 'YouTube',
      platformIcon: 'youtube',
      topic: query,
      rating: 4.0,
      publisher: 'PodRank',
      link: '#',
    };
  }
  
  async function searchYouTube(query: string): Promise<PodcastEpisode[]> {
    try {
      const YT_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!YT_API_KEY) throw new Error('YouTube API key is missing');
  
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query + ' podcast'
        )}&type=video&maxResults=5&key=${YT_API_KEY}`
      );
  
      if (!response.ok) throw new Error(`YouTube API failed: ${response.statusText}`);
  
      const data: YouTubeSearchResponse = await response.json();
      if (!data?.items) return [];
  
      return data.items
        .filter(item => item?.id?.videoId && item?.snippet)
        .map(item => ({
          id: item.id!.videoId!,
          title: item.snippet!.title || 'Untitled YouTube Video',
          description: item.snippet!.description || 'No description available',
          thumbnail: item.snippet!.thumbnails?.high?.url || '/default-podcast.jpg',
          platform: 'YouTube',
          platformIcon: 'youtube',
          topic: query,
          rating: 4.5,
          publisher: item.snippet!.channelTitle || 'Unknown YouTube Channel',
          link: item.id!.videoId!,
        }));
  
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }
  
//   async function searchSpotify(query: string): Promise<PodcastEpisode[]> {
//     try {
//       const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
//       const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
//       if (!clientId || !clientSecret) throw new Error('Spotify credentials missing');
  
//       // Get access token
//       const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
//         },
//         body: 'grant_type=client_credentials',
//       });
  
//       if (!tokenResponse.ok) throw new Error('Failed to get Spotify token');
//       const tokenData = await tokenResponse.json();
  
//       // Search for podcasts
//       const response = await fetch(
//         `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=episode&limit=5`,
//         { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
//       );
  
//       if (!response.ok) throw new Error('Spotify API failed');
//       const data: SpotifySearchResponse = await response.json();
  
//       if (!data?.episodes?.items) return [];
  
//       return data.episodes.items
//       .filter(item => item?.id)
//       .map(item => {
//         // Extract clean episode ID from various Spotify formats
//         let episodeId = item.id;
        
//         // Handle spotify:episode: format
//         if (episodeId.startsWith('spotify:episode:')) {
//           episodeId = episodeId.replace('spotify:episode:', '');
//         }
//         // Handle full URL format
//         else if (item.external_urls?.spotify) {
//           const url = new URL(item.external_urls.spotify);
//           episodeId = url.pathname.split('/').pop() || episodeId;
//         }

//         return {
//           id: episodeId,
//           title: item.name || 'Untitled Spotify Episode',
//           description: item.description || 'No description available',
//           thumbnail: item.images?.[0]?.url || '/default-podcast.jpg',
//           platform: 'Spotify',
//           platformIcon: 'spotify',
//           topic: query,
//           rating: 4.5,
//           publisher: item.show?.publisher || 'Unknown Podcast',
//           link: episodeId, // Store just the clean ID
//         };
//       });
  
//     } catch (error) {
//       console.error('Spotify search error:', error);
//       return [];
//     }
//   }
  