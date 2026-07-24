import React from 'react';
import { useNavrasa } from '../context/NavrasaContext';
import { Film, Heart, Play, X } from 'lucide-react';
import { clsx } from 'clsx';
import { LibraryEntry } from '../types';
import { motion } from 'motion/react';

const Wishlist: React.FC = () => {
  const { wishlistMovies, wishlistSeries, wishlistAnime, toggleWishlist, preferences } = useNavrasa();
  const [selectedItem, setSelectedItem] = React.useState<
    (LibraryEntry & { type: 'movie' | 'series' | 'anime' }) | null
  >(null);

  const items = [
    ...(wishlistMovies || []).map((item) => ({ ...item, type: 'movie' as const })),
    ...(wishlistSeries || []).map((item) => ({ ...item, type: 'series' as const })),
    ...(wishlistAnime || []).map((item) => ({ ...item, type: 'anime' as const }))
  ].sort((a, b) => {
    const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
    const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
    return timeB - timeA;
  });

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
              Your <span className="text-navy">Wishlist</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Future Attractions</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Selections Saved for Later Screening</p>
        </div>
      </section>

      <div className="px-4 md:px-10 pb-20 mt-12">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border-[4px] border-navy border-dashed max-w-2xl mx-auto">
            <div className="text-navy/20 mb-6 flex justify-center"><Heart size={64} /></div>
            <h3 className="text-2xl font-display text-navy mb-2">WISHLIST EMPTY</h3>
            <p className="text-navy/40 font-black uppercase tracking-widest text-[10px]">Heart a movie or series to save it for later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-10">
            {items.map((item, idx) => (
              <button
                key={`${item.type}-${item.title}-${idx}`}
                onClick={() => setSelectedItem(item)}
                className="group relative transition-all text-left"
              >
                <div className="vintage-card relative aspect-[2/3] overflow-hidden group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-300">
                  <div className="absolute inset-0 halftone opacity-10 z-1 pointer-events-none" />
                  {item.poster ? (
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="h-full w-full p-5 flex flex-col items-center justify-center gap-3 bg-accent-gold/5">
                      <Film size={32} className="text-navy/20" />
                      <span className="text-center text-navy font-black uppercase tracking-widest text-[10px] line-clamp-3">{item.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy/90 to-transparent">
                    <div className="text-[10px] font-black text-white uppercase tracking-widest line-clamp-2">{item.title}</div>
                    {item.rating && (
                      <span className="inline-block text-[10px] text-accent-gold font-black mt-1">★ {Number(item.rating).toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Retro Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-cream border-[6px] border-navy shadow-[16px_16px_0px_#C8391A] p-8 md:p-12 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 w-12 h-12 border-2 border-navy bg-white flex items-center justify-center text-navy hover:bg-accent-red hover:text-white transition-all shadow-[4px_4px_0px_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1 z-10">
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-1">
                <div className="vintage-card aspect-[2/3] overflow-hidden">
                  {selectedItem.poster ? (
                    <img src={selectedItem.poster} alt={selectedItem.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-accent-gold/10 flex items-center justify-center">
                      <Film size={48} className="text-navy/20" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display text-navy mb-2">{selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-[11px] font-black text-navy/40 uppercase tracking-[0.2em]">
                    <span>{selectedItem.year || 'Unknown Year'}</span>
                    <span className="text-accent-gold">•</span>
                    <span className="text-accent-red">{selectedItem.type}</span>
                  </div>
                </div>

                {selectedItem.match_reason && (
                  <div className="bg-white border-2 border-navy p-6 shadow-[6px_6px_0px_#E8943A] relative">
                    <div className="absolute -top-4 -left-2 text-6xl font-display text-accent-red opacity-10">"</div>
                    <p className="text-lg italic font-bold text-navy leading-relaxed relative z-10">
                      {selectedItem.match_reason}
                    </p>
                  </div>
                )}

                <p className="text-navy/70 leading-loose font-serif italic text-lg">
                  {selectedItem.overview || 'The archives contain no description for this attraction.'}
                </p>

                <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-navy/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(selectedItem, selectedItem.type);
                      setSelectedItem(null);
                    }}
                    className="h-14 px-8 border-2 border-navy bg-white text-navy font-black uppercase tracking-widest text-[11px] hover:bg-accent-red hover:text-white transition-all shadow-[4px_4px_0px_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center gap-3"
                  >
                    <Heart size={18} fill="currentColor" /> Remove Attraction
                  </button>
                  {selectedItem.has_trailer && selectedItem.trailer_url && (
                    <button
                      onClick={() => window.open(selectedItem.trailer_url, '_blank')}
                      className="vintage-button px-8 h-14"
                    >
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
