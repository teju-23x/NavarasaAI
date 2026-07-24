import React, { useRef } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Trash2, Database, Sparkles } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { motion } from 'motion/react';

type Section = 'watched' | 'watchlist';
type ItemType = 'movie' | 'series';

const Library: React.FC = () => {
  const {
    watchedMovies,
    watchedSeries,
    wishlistMovies,
    wishlistSeries,
    removeLibraryItem,
    clearLibrary,
    importLibrary,
  } = useNavrasa();

  const watchedMovieInputRef = useRef<HTMLInputElement>(null);
  const watchedSeriesInputRef = useRef<HTMLInputElement>(null);
  const wishlistMovieInputRef = useRef<HTMLInputElement>(null);
  const wishlistSeriesInputRef = useRef<HTMLInputElement>(null);

  const readAndReplace = (section: Section, type: ItemType, file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        importLibrary(type, section, result.data as any[]);
      },
    });
  };

  const renderTypeList = (
    section: Section,
    type: ItemType,
    title: string,
    items: any[],
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => (
    <div className="bg-white border-[4px] border-navy p-6 shadow-[8px_8px_0px_#1A1A2E] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-accent-gold/5 starburst opacity-20 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-display text-navy uppercase tracking-widest">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => clearLibrary(type, section)}
            className="w-10 h-10 border-2 border-navy bg-white flex items-center justify-center text-navy hover:bg-accent-red hover:text-white transition-all shadow-[3px_3px_0px_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1"
            title="Clear All"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <label className="border-[3px] border-dashed border-navy/20 bg-cream/30 p-8 text-center block cursor-pointer hover:bg-white hover:border-accent-red transition-all group mb-6">
        <UploadCloud className="mx-auto mb-3 text-accent-red group-hover:scale-110 transition-transform" size={32} />
        <div className="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Upload CSV File</div>
        <div className="text-[9px] text-navy/40 mt-1 uppercase font-bold">title, year, rating</div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readAndReplace(section, type, file);
            e.currentTarget.value = '';
          }}
        />
      </label>

      <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {items.length === 0 ? (
          <div className="text-[10px] text-navy/30 italic uppercase font-black tracking-widest text-center py-8 border-2 border-dotted border-navy/10">No records found</div>
        ) : (
          items.map((item, idx) => (
            <div key={`${item.title}-${idx}`} className="flex justify-between items-center bg-cream/50 border-2 border-navy px-4 py-3 shadow-[3px_3px_0px_#E8943A]">
              <div className="truncate text-[11px] font-black text-navy uppercase tracking-widest">
                {item.title} <span className="text-accent-red opacity-60">({item.year})</span>
              </div>
              <button
                type="button"
                onClick={() => removeLibraryItem(type, section, item.title)}
                className="text-navy hover:text-accent-red transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

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
              Data <span className="text-navy">Archives</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Sync Your History</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Manage Your Cinematic Ledger</p>
        </div>
      </section>

      <div className="px-4 md:px-10 py-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="space-y-10">
            <div className="flex items-center gap-4 text-navy">
               <Database className="text-accent-red" />
               <h2 className="text-3xl font-display uppercase tracking-widest">Watched Ledger</h2>
            </div>
            {renderTypeList('watched', 'movie', 'Feature Films', watchedMovies, watchedMovieInputRef)}
            {renderTypeList('watched', 'series', 'Broadcast Series', watchedSeries, watchedSeriesInputRef)}
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-4 text-navy">
               <Sparkles className="text-accent-gold" />
               <h2 className="text-3xl font-display uppercase tracking-widest">Future Attraction</h2>
            </div>
            {renderTypeList('watchlist', 'movie', 'Feature Films', wishlistMovies, wishlistMovieInputRef)}
            {renderTypeList('watchlist', 'series', 'Broadcast Series', wishlistSeries, wishlistSeriesInputRef)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
