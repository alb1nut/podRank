export async function searchPodcasts(category: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/search-podcasts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch podcasts');
    }
  
    return response.json();
  }