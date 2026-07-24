import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Info, 
  Star, 
  Search, 
  Sparkles, 
  Tv, 
  Layers,
  Activity
} from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const Series: React.FC = () => {
  const { tvRecommendations, loading, error, generateTVRecs, searchQuery, setSearchQuery, resetSeriesDiscovery, setError } = useNavrasa();
  const navigate = useNavigate();
  const location = useLocation();

  const autoSearchTitle =
    typeof (location.state as any)?.autoSearchTitle === 'string' && (location.state as any)?.autoSearchTitle.trim()
      ? (location.state as any)?.autoSearchTitle.trim()
      : undefined;

  const hasAutoTriggeredRef = useRef(false);

  useEffect(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    if (!autoSearchTitle) return;
    if (hasAutoTriggeredRef.current) return;
    hasAutoTriggeredRef.current = true;
    setSearchQuery(autoSearchTitle);
    generateTVRecs(autoSearchTitle);
  }, [autoSearchTitle, generateTVRecs, setSearchQuery]);

  const hasResults = tvRecommendations && tvRecommendations.length > 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative px-4 md:px-10 pt-16 md:pt-24 pb-12 text-center overflow-hidden border-b-[8px] border-double border-navy">
        <div className="absolute inset-0 starburst opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-6 relative"
          >
            <div className="absolute -inset-8 starburst opacity-30 animate-slow-rotate" />
            <h1 className="text-5xl md:text-8xl font-display tracking-tighter text-accent-red leading-none drop-shadow-lg relative">
              Television <span className="text-navy">Series</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Episodic Masterpieces</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Binge-Worthy Stories Curated by AI</p>
        </div>
      </section>

      <div className="px-4 md:px-10 pb-20 mt-12">
        {/* Search Bar */}
        <div className="relative w-full max-w-3xl group mx-auto">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
            <Search className="w-6 h-6 text-navy" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateTVRecs()}
            placeholder="Search series... e.g. Sci-fi thrillers like Dark"
            className="w-full h-16 md:h-20 bg-white border-[4px] border-navy pl-16 pr-4 md:pr-40 text-lg md:text-xl font-bold text-navy outline-none focus:bg-white shadow-[8px_8px_0px_#E8943A] transition-all placeholder:text-navy/30"
          />
          <button 
            onClick={() => generateTVRecs()} 
            disabled={loading || !searchQuery.trim()} 
            className="mt-4 md:mt-0 md:absolute right-3 md:top-1/2 md:-translate-y-1/2 h-12 md:h-14 w-full md:w-auto px-10 bg-accent-red border-[3px] border-navy text-white font-display text-lg tracking-widest hover:bg-navy hover:text-accent-gold transition-all shadow-[4px_4px_0px_#1A1A2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Quick Tags */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          {['Cyberpunk', 'Mystery', 'Space Opera', 'Period Drama', 'Sitcom'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setSearchQuery(tag); setTimeout(() => generateTVRecs(tag), 100); }}
              className="px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border-2 border-navy text-navy/70 bg-white/50 hover:bg-accent-red hover:text-white transition-all"
            >
              ★ {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        {hasResults && (
          <div className="mt-20">
            <div className="flex items-center gap-6 mb-12">
               <div className="h-[4px] flex-1 bg-navy" />
               <h2 className="text-3xl md:text-5xl font-display text-navy whitespace-nowrap">Broadcast Results</h2>
               <div className="h-[4px] flex-1 bg-navy" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-10">
              <AnimatePresence mode="popLayout">
                {tvRecommendations.map((item, idx) => (
                  <MovieCard key={item.id || idx} item={item} idx={idx} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Loading / Error States */}
        {!hasResults && !loading && !error && (
          <div className="mt-20 text-center py-20 bg-white border-[4px] border-navy border-dashed max-w-2xl mx-auto">
            <div className="text-navy/20 mb-6 flex justify-center"><Tv size={64} /></div>
            <h3 className="text-2xl font-display text-navy mb-2">TUNING SIGNAL</h3>
            <p className="text-navy/40 font-black uppercase tracking-widest text-[10px]">Search for television series to begin discovery</p>
          </div>
        )}

        {error && (
          <div className="mt-20 text-center py-20 bg-red-50 border-[4px] border-accent-red border-dashed max-w-2xl mx-auto">
            <Activity size={48} className="text-accent-red mx-auto mb-4" />
            <h3 className="text-2xl font-display text-navy mb-2">SIGNAL INTERRUPTED</h3>
            <p className="text-navy/60 font-black uppercase tracking-widest text-[10px] mb-8">{error}</p>
            <button onClick={() => generateTVRecs()} className="vintage-button px-10 h-12">Retry Search</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Series;
