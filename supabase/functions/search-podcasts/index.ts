// import { createClient } from "npm:@supabase/supabase-js@2.39.8";
// import { SpotifyWebApi } from "npm:spotify-web-api-node@5.0.2";
// import { searchYoutube } from "npm:youtube-search-api@1.2.1";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // Initialize Spotify API client
// const spotifyApi = new SpotifyWebApi({
//   clientId: Deno.env.get("SPOTIFY_CLIENT_ID"),
//   clientSecret: Deno.env.get("SPOTIFY_CLIENT_SECRET"),
// });

// // Initialize Supabase client
// const supabaseClient = createClient(
//   Deno.env.get("SUPABASE_URL") ?? "",
//   Deno.env.get("SUPABASE_ANON_KEY") ?? ""
// );

// async function refreshSpotifyToken() {
//   const authResponse = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Basic ${btoa(
//         `${Deno.env.get("SPOTIFY_CLIENT_ID")}:${Deno.env.get(
//           "SPOTIFY_CLIENT_SECRET"
//         )}`
//       )}`,
//     },
//     body: "grant_type=client_credentials",
//   });

//   const authData = await authResponse.json();
//   spotifyApi.setAccessToken(authData.access_token);
// }

// async function searchSpotifyPodcasts(query: string, category: string) {
//   await refreshSpotifyToken();

//   // Search for podcasts with the query and category
//   const searchResults = await spotifyApi.searchShows(
//     `${query} ${category}`,
//     { limit: 5 }
//   );

//   return searchResults.body.shows?.items.map((show) => ({
//     id: show.id,
//     title: show.name,
//     description: show.description,
//     publisher: show.publisher,
//     thumbnail: show.images[0]?.url,
//     platform: "Spotify",
//     platformIcon: "spotify",
//     link: show.external_urls.spotify,
//     rating: show.rating || 4.5,
//     topic: category,
//   }));
// }

// async function searchYoutubePodcasts(query: string, category: string) {
//   const searchResults = await searchYoutube(
//     `${query} ${category} podcast`,
//     "video",
//     5
//   );

//   return searchResults.items.map((item: any) => ({
//     id: item.id,
//     title: item.title,
//     description: item.description,
//     publisher: item.channelTitle,
//     thumbnail: item.thumbnail.thumbnails[0].url,
//     platform: "YouTube",
//     platformIcon: "youtube",
//     link: `https://www.youtube.com/watch?v=${item.id}`,
//     rating: 4.5,
//     topic: category,
//   }));
// }

// Deno.serve(async (req) => {
//   // Handle CORS
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const { category } = await req.json();

//     // Get category keywords
//     const categoryData = {
//       motivation: ["motivation", "inspiration", "mindset"],
//       startup: ["startup", "entrepreneurship", "business"],
//       ai: ["artificial intelligence", "technology", "innovation"],
//       leadership: ["leadership", "management", "team building"],
//       productivity: ["productivity", "time management", "efficiency"],
//     }[category] || [];

//     const query = categoryData.join(" ");

//     // Search both platforms
//     const [spotifyResults, youtubeResults] = await Promise.all([
//       searchSpotifyPodcasts(query, category),
//       searchYoutubePodcasts(query, category),
//     ]);

//     // Combine and sort results
//     const allResults = [...(spotifyResults || []), ...(youtubeResults || [])]
//       .sort(() => Math.random() - 0.5) // Simple randomization for variety
//       .slice(0, 5); // Limit to 5 results

//     return new Response(JSON.stringify(allResults), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error searching podcasts:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to search podcasts" }),
//       {
//         status: 500,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       }
//     );
//   }
// });