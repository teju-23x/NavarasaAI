import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  Movie, 
  Recommendation, 
  UserPreferences, 
  LibraryEntry, 
  STORAGE_KEYS,
  SeriesRecommendation,
  UserProfile
} from '../types';
import { getRecommendations, getTVRecommendations, getAnimeRecommendations } from '../services/geminiService';

interface NavrasaContextType {
  // Movie Discovery
  recommendations: Recommendation[];
  generateRecs: () => Promise<void>;
  
  // TV Series Discovery
  tvRecommendations: SeriesRecommendation[];
  generateTVRecs: () => Promise<void>;

  animeRecommendations: SeriesRecommendation[];
  generateAnimeRecs: (queryOverride?: string) => Promise<void>;
  animeSearchQuery: string;
  setAnimeSearchQuery: (query: string) => void;
  resetMovieDiscovery: () => void;
  resetSeriesDiscovery: () => void;
  resetAnimeDiscovery: () => void;
  
  // Library State
  watchedMovies: LibraryEntry[];
  watchedSeries: LibraryEntry[];
  watchlistMovies: LibraryEntry[];
  watchlistSeries: LibraryEntry[];
  
  // Actions
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  handleMarkWatched: (title: string, type: 'movie' | 'series') => void;
  handleAddToWatchlist: (item: any, type: 'movie' | 'series') => void;
  importLibrary: (type: 'movie' | 'series', category: 'watched' | 'watchlist', data: any[]) => void;
  removeLibraryItem: (type: 'movie' | 'series', category: 'watched' | 'watchlist', title: string) => void;
  clearLibrary: (type: 'movie' | 'series', category: 'watched' | 'watchlist') => void;
  wishlistMovies: LibraryEntry[];
  wishlistSeries: LibraryEntry[];
  wishlistAnime: LibraryEntry[];
  toggleWishlist: (item: any, type: 'movie' | 'series' | 'anime') => void;
  userRatings: Record<string, number>;
  updateRating: (title: string, rating: number) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
}

const NavrasaContext = createContext<NavrasaContextType | undefined>(undefined);

export const NavrasaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safeReadLocalStorage = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      console.error(`Error parsing localStorage key: ${key}`, error);
      return fallback;
    }
  };

  const safeReadString = (key: string, fallback = '') => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      console.error(`Error reading localStorage key: ${key}`, error);
      return fallback;
    }
  };

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [tvRecommendations, setTvRecommendations] = useState<SeriesRecommendation[]>([]);
  const [animeRecommendations, setAnimeRecommendations] = useState<SeriesRecommendation[]>([]);
  const [animeSearchQuery, setAnimeSearchQuery] = useState('');
  
  const [watchedMovies, setWatchedMovies] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WATCHED_MOVIES, []));
  
  const [watchedSeries, setWatchedSeries] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WATCHED_SERIES, []));
  
  const [watchlistMovies, setWatchlistMovies] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WATCHLIST_MOVIES, []));
  
  const [watchlistSeries, setWatchlistSeries] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WATCHLIST_SERIES, []));
  const [wishlistMovies, setWishlistMovies] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WISHLIST_MOVIES, []));
  const [wishlistSeries, setWishlistSeries] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WISHLIST_SERIES, []));
  const [wishlistAnime, setWishlistAnime] = useState<LibraryEntry[]>(() => safeReadLocalStorage(STORAGE_KEYS.WISHLIST_ANIME, []));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>(() => safeReadLocalStorage(STORAGE_KEYS.API_CACHE + '_prefs', {
    languages: ['English', 'Tamil'],
    genres: ['Drama', 'Thriller'],
    industries: ['Hollywood', 'Kollywood'],
    contentType: 'both',
    moods: ['Epic', 'Intimate']
  }));

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => safeReadLocalStorage(STORAGE_KEYS.USER_RATINGS, {}));

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = safeReadString('navrasa_profile') || safeReadString('user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || safeReadString('user_name') || 'Guest Viewer',
          avatarIndex: parsed.avatarIndex ?? 0,
          avatarType: parsed.avatarType || 'cinema',
        };
      }
    } catch (e) {
      console.error('Error parsing user profile:', e);
    }
    
    return {
      name: safeReadString('user_name') || 'Guest Viewer',
      avatarIndex: 0,
      avatarType: 'abstract'
    };
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHED_MOVIES, JSON.stringify(watchedMovies));
  }, [watchedMovies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHED_SERIES, JSON.stringify(watchedSeries));
  }, [watchedSeries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST_MOVIES, JSON.stringify(watchlistMovies));
  }, [watchlistMovies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST_SERIES, JSON.stringify(watchlistSeries));
  }, [watchlistSeries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST_MOVIES, JSON.stringify(wishlistMovies));
  }, [wishlistMovies]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST_SERIES, JSON.stringify(wishlistSeries));
  }, [wishlistSeries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST_ANIME, JSON.stringify(wishlistAnime));
  }, [wishlistAnime]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_CACHE + '_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem('navrasa_last_movie_results', JSON.stringify(recommendations));
      localStorage.setItem('navrasa_last_movie_query', searchQuery);
    }
  }, [recommendations, searchQuery]);

  useEffect(() => {
    if (tvRecommendations.length > 0) {
      localStorage.setItem('navrasa_last_tv_results', JSON.stringify(tvRecommendations));
      localStorage.setItem('navrasa_last_tv_query', searchQuery);
    }
  }, [tvRecommendations, searchQuery]);

  useEffect(() => {
    if (animeRecommendations.length > 0) {
      localStorage.setItem('navrasa_last_anime_results', JSON.stringify(animeRecommendations));
      localStorage.setItem('navrasa_last_anime_query', animeSearchQuery);
    }
  }, [animeRecommendations, animeSearchQuery]);

  // Initial load of last results
  useEffect(() => {
    const lastMovies = safeReadLocalStorage('navrasa_last_movie_results', null);
    const lastMovieQuery = localStorage.getItem('navrasa_last_movie_query');
    if (lastMovies) setRecommendations(lastMovies);
    if (lastMovieQuery) setSearchQuery(lastMovieQuery);

    const lastTV = safeReadLocalStorage('navrasa_last_tv_results', null);
    const lastTVQuery = localStorage.getItem('navrasa_last_tv_query');
    if (lastTV) setTvRecommendations(lastTV);
    if (lastTVQuery) setSearchQuery(lastTVQuery);

    const lastAnime = safeReadLocalStorage('navrasa_last_anime_results', null);
    const lastAnimeQuery = localStorage.getItem('navrasa_last_anime_query');
    if (lastAnime) setAnimeRecommendations(lastAnime);
    if (lastAnimeQuery) setAnimeSearchQuery(lastAnimeQuery);
  }, []);

  const updateRating = useCallback((title: string, rating: number) => {
    setUserRatings(prev => {
      const next = { ...prev, [title]: rating };
      localStorage.setItem(STORAGE_KEYS.USER_RATINGS, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...profile };
      localStorage.setItem('user_profile', JSON.stringify(next));
      const current = safeReadString('navrasa_profile');
      const existing = current ? JSON.parse(current) : {};
      localStorage.setItem('navrasa_profile', JSON.stringify({ ...existing, ...next }));
      if (next.name) localStorage.setItem('user_name', next.name);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('navrasa_session');
    window.location.href = '/login';
  }, []);

  const importLibrary = useCallback((type: 'movie' | 'series', category: 'watched' | 'watchlist', data: any[]) => {
    const entries: LibraryEntry[] = data.map(item => ({
      title: item.title || item.Name,
      year: parseInt(item.year || item.Year),
      rating: parseFloat(item.rating || item.Rating) || undefined,
      type,
      isWatchlist: category === 'watchlist',
      addedAt: new Date().toISOString(),
      source: 'imported'
    }));

    if (type === 'movie') {
      if (category === 'watched') setWatchedMovies(entries);
      else setWishlistMovies(entries);
    } else {
      if (category === 'watched') setWatchedSeries(entries);
      else setWishlistSeries(entries);
    }
  }, []);

  const removeLibraryItem = useCallback((type: 'movie' | 'series', category: 'watched' | 'watchlist', title: string) => {
    if (type === 'movie') {
      if (category === 'watched') setWatchedMovies(prev => prev.filter(item => item.title !== title));
      else setWishlistMovies(prev => prev.filter(item => item.title !== title));
    } else {
      if (category === 'watched') setWatchedSeries(prev => prev.filter(item => item.title !== title));
      else setWishlistSeries(prev => prev.filter(item => item.title !== title));
    }
  }, []);

  const clearLibrary = useCallback((type: 'movie' | 'series', category: 'watched' | 'watchlist') => {
    if (type === 'movie') {
      if (category === 'watched') setWatchedMovies([]);
      else setWishlistMovies([]);
    } else {
      if (category === 'watched') setWatchedSeries([]);
      else setWishlistSeries([]);
    }
  }, []);

  const generateRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const recs = await getRecommendations(watchedMovies, preferences, searchQuery);
      const filteredRecs = recs.filter(rec => {
        const isAlreadyWatched = watchedMovies.some(m => m.title.toLowerCase() === rec.title.toLowerCase());
        return !isAlreadyWatched;
      });
      setRecommendations(filteredRecs);
    } catch (err) {
      console.error('Recommendation Error:', err);
      setError('Could not fetch movie recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateTVRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTVRecommendations(watchedSeries, preferences, searchQuery);
      console.log('Series API Raw Response:', response);
      
      const { series, songs } = response;
      console.log('Series array from response:', series);

      const filteredSeries = (series || []).filter(s => {
        const isAlreadyWatched = watchedSeries.some(ws => ws.title.toLowerCase() === s.title.toLowerCase());
        return !isAlreadyWatched;
      });
      
      console.log('Filtered Series:', filteredSeries);
      setTvRecommendations(filteredSeries);
    } catch (err) {
      console.error('TV Recommendation Error:', err);
      setError('Could not fetch TV series recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateAnimeRecs = async (queryOverride?: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = queryOverride !== undefined ? queryOverride : animeSearchQuery;
      const data = await getAnimeRecommendations(q);
      const results = data.anime || data.series || [];
      const mapped: SeriesRecommendation[] = results.map((s) => ({
        ...s,
        id: s.title.toLowerCase().replace(/\s+/g, '-'),
        type: 'anime' as const
      }));
      setAnimeRecommendations(mapped);
    } catch (err) {
      console.error('Anime recommendation error:', err);
      setError('Could not fetch anime recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetMovieDiscovery = useCallback(() => {
    setRecommendations([]);
    setLoading(false);
    setError(null);
  }, []);

  const resetSeriesDiscovery = useCallback(() => {
    setTvRecommendations([]);
    setLoading(false);
    setError(null);
  }, []);

  const resetAnimeDiscovery = useCallback(() => {
    setAnimeRecommendations([]);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    setRecommendations([]);
    setTvRecommendations([]);
    setAnimeRecommendations([]);
    setLoading(false);
    setError(null);
  }, [preferences.contentType]);

  const handleMarkWatched = (title: string, type: 'movie' | 'series') => {
    const entry: LibraryEntry = {
      title,
      year: new Date().getFullYear(),
      type,
      isWatchlist: false,
      addedAt: new Date().toISOString()
    };

    if (type === 'movie') {
      setWatchedMovies(prev => [entry, ...prev.filter(m => m.title !== title)]);
      setWatchlistMovies(prev => prev.filter(m => m.title !== title));
      setRecommendations(prev => prev.filter(r => r.title !== title));
    } else {
      setWatchedSeries(prev => [entry, ...prev.filter(s => s.title !== title)]);
      setWatchlistSeries(prev => prev.filter(s => s.title !== title));
      setTvRecommendations(prev => prev.filter(r => r.title !== title));
    }
  };

  const handleAddToWatchlist = (item: any, type: 'movie' | 'series') => {
    const entry: LibraryEntry = {
      title: item.title,
      year: parseInt(item.year) || new Date().getFullYear(),
      poster: item.poster,
      type,
      isWatchlist: true,
      addedAt: new Date().toISOString()
    };

    if (type === 'movie') {
      setWatchlistMovies(prev => [entry, ...prev.filter(m => m.title !== item.title)]);
    } else {
      setWatchlistSeries(prev => [entry, ...prev.filter(s => s.title !== item.title)]);
    }
  };

  const toggleWishlist = useCallback((item: any, type: 'movie' | 'series' | 'anime') => {
    const entry: LibraryEntry = {
      title: item.title,
      year: parseInt(item.year) || new Date().getFullYear(),
      rating: item.rating,
      poster: item.poster,
      id: item.id || item.title?.toLowerCase?.()?.replace(/\s+/g, '-'),
      type,
      isWatchlist: true,
      addedAt: new Date().toISOString(),
      source: 'manual',
      overview: item.overview,
      match_reason: item.match_reason,
      trailer_url: item.trailer_url,
      has_trailer: item.has_trailer,
      genres: item.genres,
      streaming: item.streaming,
      cast: item.cast,
      crew: item.crew,
      tmdb_id: item.tmdb_id,
      original_language: item.original_language,
      language: item.language,
      runtime: item.runtime,
      total_seasons: item.total_seasons,
      episode_count: item.episode_count,
      number_of_episodes: item.number_of_episodes,
      status: item.status
    };
    const updateList = (setter: React.Dispatch<React.SetStateAction<LibraryEntry[]>>) => {
      setter((prev) =>
        prev.some((i) => i.title === item.title)
          ? prev.filter((i) => i.title !== item.title)
          : [entry, ...prev.filter((i) => i.title !== item.title)]
      );
    };
    if (type === 'movie') {
      updateList(setWishlistMovies);
    } else if (type === 'series') {
      updateList(setWishlistSeries);
    } else {
      updateList(setWishlistAnime);
    }
  }, []);

  return (
    <NavrasaContext.Provider value={{
      recommendations,
      generateRecs,
      tvRecommendations,
      generateTVRecs,
      animeRecommendations,
      generateAnimeRecs,
      animeSearchQuery,
      setAnimeSearchQuery,
      resetMovieDiscovery,
      resetSeriesDiscovery,
      resetAnimeDiscovery,
      watchedMovies,
      watchedSeries,
      watchlistMovies,
      watchlistSeries,
      loading,
      error,
      setError,
      searchQuery,
      setSearchQuery,
      preferences,
      setPreferences,
      handleMarkWatched,
      handleAddToWatchlist,
      importLibrary,
      removeLibraryItem,
      clearLibrary,
      wishlistMovies,
      wishlistSeries,
      wishlistAnime,
      toggleWishlist,
      userRatings,
      updateRating,
      userProfile,
      updateProfile,
      logout
    }}>
      {children}
    </NavrasaContext.Provider>
  );
};

export const useNavrasa = () => {
  const context = useContext(NavrasaContext);
  if (context === undefined) {
    throw new Error('useNavrasa must be used within a NavrasaProvider');
  }
  return context;
};
