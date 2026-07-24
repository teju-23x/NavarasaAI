import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Play, ChevronRight, Heart } from 'lucide-react';
import { Recommendation, SeriesRecommendation, StreamingPlatform } from '../types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';

interface MovieCardProps {
  item: Recommendation | SeriesRecommendation;
  idx: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, idx }) => {
  const navigate = useNavigate();
  const { wishlistMovies, wishlistSeries, wishlistAnime, toggleWishlist } = useNavrasa();

  const displayRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return "N/A";
    return rating.toFixed(1);
  };

  const isSeriesLike = (item: Recommendation | SeriesRecommendation): item is SeriesRecommendation => {
    return item.type === 'series' || item.type === 'anime';
  };

  const wished = isSeriesLike(item)
    ? (item.type === 'anime' ? wishlistAnime : wishlistSeries).some((entry) => entry.title === item.title)
    : wishlistMovies.some((entry) => entry.title === item.title);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: idx * 0.04 }}
      className="group relative cursor-pointer"
      onClick={() => {
        if (item.type === 'anime') navigate(`/anime/${item.id}`);
        else if (item.type === 'series') navigate(`/series/${item.id}`);
        else navigate(`/movie/${item.id}`);
      }}
    >
       <div className="vintage-card relative aspect-[2/3] overflow-hidden group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-300">
          {/* Halftone Pattern Overlay */}
          <div className="absolute inset-0 halftone opacity-10 z-1 pointer-events-none" />
          
          <img 
            src={item.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000"} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
             {item.has_trailer && (
               <div className="mb-2 self-start bg-accent-gold text-navy text-[8px] font-black px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#1A1A2E]">
                 <Play size={8} fill="currentColor" /> TRAILER AVAILABLE
               </div>
             )}
             <p className="text-[11px] font-black italic text-cream leading-relaxed line-clamp-3">
                "{item.match_reason}"
             </p>
          </div>

          {/* Action Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 toggleWishlist(item, item.type === 'anime' ? 'anime' : isSeriesLike(item) ? 'series' : 'movie');
               }}
               className={clsx(
                 "w-9 h-9 border-2 border-navy flex items-center justify-center transition-all",
                 wished ? "bg-accent-red text-white" : "bg-white text-navy hover:bg-accent-gold"
               )}
             >
               <Heart size={16} fill={wished ? "currentColor" : "none"} />
             </button>
             <div className="bg-accent-red border-2 border-navy px-2 py-1 text-white text-[10px] font-black shadow-[2px_2px_0px_#1A1A2E]">
                ★ {displayRating(item.rating)}
             </div>
          </div>
       </div>

       <div className="mt-4 text-center">
          <h4 className="text-sm font-black text-navy uppercase tracking-widest line-clamp-1 group-hover:text-accent-red transition-colors">{item.title}</h4>
          <div className="flex items-center justify-center gap-2 mt-1">
             <span className="text-[10px] text-navy/40 font-black uppercase tracking-tighter">{item.year}</span>
             <span className="text-accent-gold">•</span>
             <span className="text-[10px] text-navy/40 font-black uppercase tracking-tighter">{item.type}</span>
          </div>

          {/* Streaming Logos per Fix 2 */}
          {item.streaming && item.streaming.length > 0 && (
             <div className="flex justify-center gap-1.5 mt-3">
                 {item.streaming
                    .filter((s: any) => typeof s !== 'string' && s?.logo)
                    .slice(0, 3)
                    .map((s: any, i: number) => (
                      <div key={i} className="w-7 h-7 bg-white border border-navy/10 rounded-full p-1 shadow-sm flex items-center justify-center group/logo hover:scale-110 transition-transform">
                         <img 
                           src={s.logo} 
                           alt={s.name || 'Platform'} 
                           className="w-full h-full object-contain grayscale-[0.2] group-hover/logo:grayscale-0"
                         />
                      </div>
                   ))}
             </div>
          )}
       </div>
    </motion.div>
  );
};

export default MovieCard;
