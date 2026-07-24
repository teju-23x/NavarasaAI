import { 
  Movie, 
  Recommendation, 
  UserPreferences, 
  WebhookResponse,
  TVWebhookResponse,
  SeriesRecommendation
} from "../types";

const MOVIES_WEBHOOK_URL = "https://navarasaai.app.n8n.cloud/webhook/recommendations";
const TV_WEBHOOK_URL = "https://navarasaai.app.n8n.cloud/webhook/tv-recommendations";

const trackSearchStats = (language: string, genre: string[] = []) => {
  try {
    const raw = localStorage.getItem('navrasa_search_stats');
    const stats = raw
      ? JSON.parse(raw)
      : { totalSearches: 0, language: {}, genre: {} };
    stats.totalSearches += 1;
    if (language) stats.language[language] = (stats.language[language] || 0) + 1;
    genre.forEach((g) => {
      stats.genre[g] = (stats.genre[g] || 0) + 1;
    });
    localStorage.setItem('navrasa_search_stats', JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to track search stats', error);
  }
};

const cacheApiResponse = (endpoint: string, payload: unknown, response: unknown) => {
  try {
    const raw = localStorage.getItem('navrasa_api_cache');
    const cache = raw ? JSON.parse(raw) : [];
    const entry = {
      endpoint,
      payload,
      response,
      timestamp: new Date().toISOString()
    };
    const next = [entry, ...cache].slice(0, 5);
    localStorage.setItem('navrasa_api_cache', JSON.stringify(next));
  } catch (error) {
    console.warn('Failed to cache api response', error);
  }
};

const languageMap: Record<string, string> = {
  'Tamil': 'ta',
  'Hindi': 'hi',
  'English': 'en',
  'Telugu': 'te',
  'Malayalam': 'ml',
  'French': 'fr',
  'Spanish': 'es',
  'Korean': 'ko',
  'Japanese': 'ja',
  'Chinese': 'zh'
};

const industryMap: Record<string, string> = {
  'Hollywood': 'Hollywood',
  'Kollywood': 'Kollywood',
  'Mollywood': 'Mollywood',
  'Bollywood': 'Bollywood',
  'Anime': 'Anime',
  'K-Drama': 'K-Drama',
  'European Cinema': 'European Cinema'
};

export async function getRecommendations(
  movies: any[],
  preferences: UserPreferences,
  query: string = ""
): Promise<Recommendation[]> {
  const langContext = preferences.languages.map(l => languageMap[l] || l).join('/');
  const indContext = preferences.industries.map(i => industryMap[i] || i).join('/');

  const body = {
    name: query ? `${query} (${indContext} ${langContext})` : "latest movies",
    preferences: {
      language: langContext,
      industry: indContext,
      genre: preferences.genres,
      mood: preferences.moods,
      content_type: preferences.contentType
    },
    watched_ids: movies.filter(m => !m.isWatchlist).map(m => ({ title: m.title, year: m.year })),
    context: `User industry: ${indContext}, Language: ${langContext}`
  };
  trackSearchStats(body.preferences.language, body.preferences.genre);

  try {
    const response = await fetch(MOVIES_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WebhookResponse = await response.json();
    cacheApiResponse(MOVIES_WEBHOOK_URL, body, data);

    const movieRecs: Recommendation[] = (data.movies || []).map(m => ({
      ...m,
      id: m.title.toLowerCase().replace(/\s+/g, '-'),
      type: 'movie' as const
    }));

    const songRecs: Recommendation[] = (data.songs || []).map((songTitle, index) => ({
      id: `song-${index}`,
      title: songTitle,
      year: '',
      rating: 0,
      poster: '',
      genres: [],
      overview: '',
      match_reason: 'Featured soundtrack',
      streaming: [],
      has_trailer: false,
      type: 'song' as const
    }));

    return [...movieRecs, ...songRecs];
  } catch (error: any) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getTVRecommendations(
  watchedSeries: any[],
  preferences: UserPreferences,
  query: string = ""
): Promise<{ series: SeriesRecommendation[], songs: Recommendation[] }> {
  const langContext = preferences.languages.map(l => languageMap[l] || l).join('/');
  const indContext = preferences.industries.map(i => industryMap[i] || i).join('/');

  const body = {
    name: query ? `${query} (${indContext} ${langContext})` : "latest series",
    preferences: {
      language: langContext,
      industry: indContext,
      genre: preferences.genres,
      mood: preferences.moods,
      content_type: 'series'
    },
    watched_series: watchedSeries.map(s => ({ title: s.title, year: s.year })),
    context: `User industry: ${indContext}, Language: ${langContext}`
  };
  trackSearchStats(body.preferences.language, body.preferences.genre);

  try {
    const response = await fetch(TV_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TVWebhookResponse = await response.json();
    cacheApiResponse(TV_WEBHOOK_URL, body, data);

    const seriesRecs: SeriesRecommendation[] = (data.series || []).map(s => ({
      ...s,
      id: s.title.toLowerCase().replace(/\s+/g, '-'),
      type: 'series' as const
    }));

    const songRecs: Recommendation[] = (data.songs || []).map((songTitle, index) => ({
      id: `tv-song-${index}`,
      title: songTitle,
      year: '',
      rating: 0,
      poster: '',
      genres: [],
      overview: '',
      match_reason: 'Featured soundtrack',
      streaming: [],
      has_trailer: false,
      type: 'song' as const
    }));

    return { series: seriesRecs, songs: songRecs };
  } catch (error: any) {
    console.error("TV Fetch error:", error);
    throw error;
  }
}

export async function getAnimeRecommendations(query: string = ""): Promise<TVWebhookResponse> {
  const body = {
    name: query.trim() || "anime",
    preferences: {
      content_type: "anime",
      language: "ja",
      genre: [] as string[],
      mood: [] as string[]
    },
    watched_series: [] as { title: string; year: number }[]
  };
  trackSearchStats("ja", []);

  const response = await fetch(TV_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: TVWebhookResponse = await response.json();
  cacheApiResponse(TV_WEBHOOK_URL, body, data);
  return data;
}

export async function getTrendingRecommendations(language = 'all') {
  const body = {
    name: "trending today",
    preferences: {
      language,
      content_type: "movie"
    },
    watched_movies: []
  };

  const response = await fetch(MOVIES_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: WebhookResponse = await response.json();
  cacheApiResponse(MOVIES_WEBHOOK_URL, body, data);
  trackSearchStats(language, []);
  return (data.movies || []).map((m) => ({
    ...m,
    id: m.title.toLowerCase().replace(/\s+/g, '-'),
    type: 'movie' as const
  }));
}

export async function getPersonDetails(actorName: string, contentType: 'movie' | 'series' = 'movie') {
  const endpoint = contentType === 'series' ? TV_WEBHOOK_URL : MOVIES_WEBHOOK_URL;
  const body = {
    name: `tell me about ${actorName}`,
    preferences: { content_type: contentType },
    watched_movies: []
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  cacheApiResponse(endpoint, body, data);
  return data;
}

export async function runWebhookTest(query: string, type: 'movie' | 'series') {
  const endpoint = type === 'series' ? TV_WEBHOOK_URL : MOVIES_WEBHOOK_URL;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: query,
      preferences: { content_type: type },
      watched_movies: []
    })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  cacheApiResponse(endpoint, { query, type }, data);
  return data;
}
