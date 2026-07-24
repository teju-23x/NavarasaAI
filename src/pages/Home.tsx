import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import MovieCard from '../components/MovieCard';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

const languageTabs = [
  { label: 'Malayalam', code: 'ml' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Telugu', code: 'te' },
  { label: 'Korean', code: 'ko' },
  { label: 'English', code: 'en' },
  { label: 'All', code: 'all' }
];

const Home: React.FC = () => {
  const { recommendations, loading, generateRecs, searchQuery, setSearchQuery, setError } = useNavrasa();
  const location = useLocation();
  const [activeLang, setActiveLang] = useState('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickChips = ['Gritty crime thrillers', 'Classic romantic comedy', 'Sci-fi visuals', '90s action', 'Korean drama'];

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
    if (searchQuery !== autoSearchTitle) {
      hasAutoTriggeredRef.current = false;
      setSearchQuery(autoSearchTitle);
    }
  }, [autoSearchTitle, searchQuery, setSearchQuery]);

  useEffect(() => {
    if (!autoSearchTitle) return;
    if (hasAutoTriggeredRef.current) return;
    if (searchQuery !== autoSearchTitle) return;
    hasAutoTriggeredRef.current = true;
    generateRecs();
  }, [autoSearchTitle, searchQuery, generateRecs]);

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
              Navarasa <span className="text-navy">AI</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Now Featuring</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Cinematic Wonders for the Modern Viewer</p>
        </div>
      </section>

      <div className="px-4 md:px-10 pb-20 mt-12">
        {/* Search Bar */}
        <div className="relative w-full max-w-3xl group mx-auto">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
            <Search className="w-6 h-6 text-navy" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateRecs()}
            placeholder="Type your cinematic desire..."
            className="w-full h-16 md:h-20 bg-white border-[4px] border-navy pl-16 pr-4 md:pr-40 text-lg md:text-xl font-bold text-navy outline-none focus:bg-white shadow-[8px_8px_0px_#E8943A] transition-all placeholder:text-navy/30"
          />
          <button 
            onClick={() => generateRecs()} 
            disabled={loading || !searchQuery.trim()} 
            className="mt-4 md:mt-0 md:absolute right-3 md:top-1/2 md:-translate-y-1/2 h-12 md:h-14 w-full md:w-auto px-10 bg-accent-red border-[3px] border-navy text-white font-display text-lg tracking-widest hover:bg-navy hover:text-accent-gold transition-all shadow-[4px_4px_0px_#1A1A2E] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Language Tabs */}
        <div className="mt-12 flex gap-3 overflow-x-auto pb-4 justify-center custom-scrollbar">
          {languageTabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => {
                setActiveLang(tab.code);
                if (tab.code === 'all') {
                  setSearchQuery('');
                } else {
                  setSearchQuery(`${tab.label.toLowerCase()} `);
                }
                searchInputRef.current?.focus();
              }}
              className={clsx(
                "px-6 py-2 border-[3px] border-navy font-black uppercase tracking-widest text-xs transition-all flex-shrink-0",
                activeLang === tab.code 
                  ? "bg-accent-gold text-navy shadow-[4px_4px_0px_#C8391A]" 
                  : "bg-white text-navy/60 hover:bg-cream hover:text-navy"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Chips */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchQuery(chip);
                searchInputRef.current?.focus();
              }}
              className="px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border-2 border-navy text-navy/70 bg-white/50 hover:bg-accent-red hover:text-white hover:border-navy transition-all"
            >
              ★ {chip}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-6 mb-12">
               <div className="h-[4px] flex-1 bg-navy" />
               <h2 className="text-3xl md:text-5xl font-display text-navy whitespace-nowrap">Screening Results</h2>
               <div className="h-[4px] flex-1 bg-navy" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-10">
              {recommendations.filter((r) => r.type !== 'song').map((rec, idx) => (
                <MovieCard key={rec.id} item={rec} idx={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
