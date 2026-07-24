export interface Movie {
  title: string;
  year: number;
  rating?: number;
  watchedDate?: string;
  isWatchlist?: boolean;
}

export interface SeriesEntry {
  title: string;
  year: number;
  rating?: number;
  watchedDate?: string;
  isWatchlist?: boolean;
}

export interface CastMember {
  name: string;
  character: string;
  photo: string | null;
}

export interface Recommendation {
  id: string;
  title: string;
  year: string;
  rating: number;
  poster: string;
  genres: string[];
  overview: string;
  match_reason: string;
  streaming: StreamingPlatform[] | string[];
  trailer_url?: string;
  has_trailer: boolean;
  type: 'movie' | 'song';
  cast?: CastMember[];
  original_language?: string;
  language?: string;
  runtime?: number;
}

export interface SeriesRecommendation {
  id: string;
  title: string;
  year: string;
  rating: number;
  poster: string;
  genres: string[];
  overview: string;
  match_reason: string;
  streaming: StreamingPlatform[];
  trailer_url?: string;
  has_trailer: boolean;
  total_seasons: number;
  episode_count?: number;
  number_of_episodes?: number;
  status: 'Returning Series' | 'Ended' | 'In Production' | string;
  type: 'series' | 'anime';
  cast?: CastMember[];
}

export interface LibraryEntry {
  title: string;
  year: number;
  rating?: number;
  poster?: string;
  type: 'movie' | 'series' | 'anime';
  isWatchlist: boolean;
  addedAt: string;
  source?: 'imported' | 'manual';
  id?: string;
  overview?: string;
  match_reason?: string;
  trailer_url?: string;
  has_trailer?: boolean;
  genres?: string[];
  streaming?: StreamingPlatform[] | string[];
  cast?: CastMember[];
  crew?: string[];
  tmdb_id?: number | string;
  original_language?: string;
  language?: string;
  runtime?: number;
  total_seasons?: number;
  episode_count?: number;
  number_of_episodes?: number;
  status?: string;
}

export interface StreamingPlatform {
  name: string;
  logo?: string;
}

export interface WebhookResponse {
  movies: Omit<Recommendation, 'type'>[];
  songs: string[];
}

export interface TVWebhookResponse {
  series?: Omit<SeriesRecommendation, 'type' | 'id'>[];
  anime?: Omit<SeriesRecommendation, 'type' | 'id'>[];
  songs?: string[];
  total?: number;
}

export interface UserPreferences {
  languages: string[];
  genres: string[];
  industries: string[];
  contentType: 'movies' | 'songs' | 'series' | 'both';
  moods: string[];
}

export interface UserProfile {
  name: string;
  avatarIndex: number;
  avatarType: 'abstract' | 'cinema';
}

// Library storage keys
export const STORAGE_KEYS = {
  WATCHED_MOVIES: 'navrasa_watched_movies',
  WATCHED_SERIES: 'navrasa_watched_series',
  WATCHLIST_MOVIES: 'navrasa_watchlist_movies',
  WATCHLIST_SERIES: 'navrasa_watchlist_series',
  WISHLIST_MOVIES: 'navrasa_wishlist_movies',
  WISHLIST_SERIES: 'navrasa_wishlist_series',
  WISHLIST_ANIME: 'navrasa_wishlist_anime',
  USER_RATINGS: 'navarasa_ratings',
  SEARCH_STATS: 'navrasa_search_stats',
  API_CACHE: 'navrasa_api_cache',
} as const;
