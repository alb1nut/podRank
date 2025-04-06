import { searchPodcasts as searchPodcastsExternal } from './podcastSearch';

export async function searchPodcasts(category: string) {
  try {
    if (!category) {
      throw new Error('Category is required');
    }
    
    const results = await searchPodcastsExternal(category);
    
    if (!results || results.length === 0) {
      throw new Error('No podcasts found');
    }
    
    return results;
  } catch (error) {
    console.error('Error searching podcasts:', error);
    throw new Error('Failed to fetch podcasts. Please try again.');
  }
}