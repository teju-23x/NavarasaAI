import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  Play,
  Globe, 
  Layers, 
  Heart 
} from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { SeriesRecommendation, StreamingPlatform } from '../types';

const SeriesDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tvRecommendations, animeRecommendations, watchedSeries, watchedAnime, loading: contextLoading, wishlistSeries, toggleWishlist } = useNavrasa();
  const [scrollY, setScrollY] = useState(0);

  // Combine all possible sources for the series
  const allSeries = [
    ...(tvRecommendations || []), 
    ...(animeRecommendations || []),
    ...(watchedSeries || []).map(m => ({
      id: m.id || m.title.toLowerCase().replace(/\s+/g, '-'),
      title: m.title,
      year: m.year?.toString() || 'N/A',
      rating: m.rating || 0,
      poster: m.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
      genres: [],
      overview: "Series details are synchronized from your collection.",
      match_reason: "This is part of your curated history.",
      streaming: [],
      has_trailer: false,
      type: 'series' as const
    }))
  ];

  const series = allSeries.find(m => m.id === id) as SeriesRecommendation | undefined;
  const inWishlist = (wishlistSeries || []).some((entry) => entry.title === series?.title);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-20">
         <div className="w-16 h-16 border-[4px] border-navy border-t-accent-red rounded-full animate-spin mb-8" />
         <p className="text-navy font-display text-2xl uppercase tracking-widest">Rolling Film...</p>
      </div>
    );
  }

  if (!series) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-20 text-center">
       <div className="w-24 h-24 border-[4px] border-navy bg-white shadow-[6px_6px_0px_#C8391A] flex items-center justify-center mb-8 text-accent-red">
          <Star size={48} />
       </div>
       <h2 className="text-5xl font-display text-navy mb-4">REEL NOT FOUND</h2>
       <p className="text-navy/60 mb-10 italic uppercase font-black tracking-widest">The archives seem to be missing this selection.</p>
       <button 
        onClick={() => navigate(-1)}
        className="vintage-button px-10 h-14"
       >
         Back to Box Office
       </button>
    </div>
  );

  const displayRating = (rating: number | undefined) => {
    if (rating === undefined || rating === 0) return "N/A";
    return rating.toFixed(1);
  };

  // Only show streaming if it exists and has TMDB logos, deduplicated by name
  const validStreaming = (series?.streaming || [])
    .filter((s): s is StreamingPlatform => 
      typeof s !== 'string' && !!s?.logo && !!s?.name && s?.logo?.startsWith('https://image.tmdb.org')
    )
    .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
    .slice(0, 4);

  return (
    <div className="relative bg-cream min-h-screen transition-colors duration-300">
      {/* Hero Banner Section */}
      <section className="relative h-[600px] w-full overflow-hidden border-b-[8px] border-double border-navy">
        <div className="absolute inset-0 starburst opacity-20 z-0" />
        
        {/* Backdrop Image with Parallax */}
        <div 
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          <img 
            src={series?.poster} 
            alt={series?.title} 
            className="w-full h-full object-cover grayscale-[0.2]"
            style={{ objectPosition: 'center 20%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/50 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-10 h-12 px-6 bg-white border-2 border-navy text-navy font-black uppercase tracking-widest hover:bg-accent-red hover:text-white transition-all z-20 shadow-[4px_4px_0px_#1A1A2E]"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft size={18} />
            ◀ BACK TO RESULTS
          </div>
        </button>

        {/* Hero Bottom Content */}
        <div className="absolute bottom-12 left-10 max-w-[900px] z-10 px-6">
          <div className="flex flex-wrap gap-3 mb-8">
             {series?.genres?.map(g => (
               <span key={g} className="bg-accent-red border-2 border-navy text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-[3px_3px_0px_#1A1A2E]">{g}</span>
             ))}
             <span className="bg-white border-2 border-navy text-navy text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-[3px_3px_0px_#E8943A]">{series?.year || 'N/A'}</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-display text-navy leading-none mb-6 drop-shadow-xl"
          >
            {series?.title}
          </motion.h1>

          <div className="flex items-center gap-6 text-[11px] font-black text-navy/60 uppercase tracking-[0.3em]">
             <span className="flex items-center gap-2 text-accent-red bg-white border-2 border-navy px-4 py-2 shadow-[4px_4px_0px_#E8943A]">
               <Star size={18} fill="currentColor" /> Rating: {displayRating(series?.rating)}
             </span>
             <span className="text-navy/20">•</span>
             <span>Recommended Selection</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-12 px-10 py-16">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-12">
          
          {/* Why Recommended */}
          {series?.match_reason && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="vintage-card p-12 relative overflow-hidden"
            >
               <div className="absolute top-[-20px] left-[-20px] text-[160px] font-display text-navy opacity-5 pointer-events-none">"</div>
               <div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 border-2 border-navy bg-accent-red items-center justify-center text-white flex">
                    <Star size={20} />
                  </div>
                  <span className="text-sm font-black text-navy uppercase tracking-[0.3em]">The AI Curator's Note</span>
               </div>
               <p className="text-2xl md:text-3xl font-serif italic text-navy leading-relaxed px-2 relative z-10 font-bold">
                  "{series.match_reason}"
               </p>
            </motion.div>
          )}

          {/* Cast Section */}
          {series?.cast && series.cast.length > 0 && (
            <section className="bg-white border-[3px] border-navy p-10 shadow-[8px_8px_0px_#E8943A]">
               <div className="flex items-center gap-3 mb-10 text-navy text-2xl font-display">
                  <div className="w-10 h-10 border-2 border-navy bg-accent-gold flex items-center justify-center text-navy text-sm font-black">★</div>
                  STARRING CAST
               </div>
               <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 -mx-4 px-4">
                 {series.cast.map((actor, idx) => (
                   <button key={idx} onClick={() => navigate(`/person/${encodeURIComponent(actor.name)}?context=series`)} className="flex-shrink-0 w-[140px] text-left group">
                     <div className="w-full aspect-[2/3] bg-cream border-[3px] border-navy shadow-[4px_4px_0px_#1A1A2E] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all mb-4 overflow-hidden relative">
                       {actor.photo ? <img src={actor.photo} alt={actor.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" /> : <div className="w-full h-full flex items-center justify-center text-navy font-display text-2xl bg-accent-gold/10 halftone">{actor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>}
                       <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
                     </div>
                     <div className="px-1">
                        <div className="text-[12px] font-black text-navy uppercase tracking-widest line-clamp-2 leading-tight group-hover:text-accent-red transition-colors">{actor.name}</div>
                        <div className="text-[10px] text-navy/40 font-bold uppercase tracking-widest mt-1 truncate">{actor.character}</div>
                     </div>
                   </button>
                 ))}
               </div>
            </section>
          )}

          {/* Overview */}
          {series?.overview && (
            <section className="bg-white border-[3px] border-navy p-10 shadow-[8px_8px_0px_#E8943A]">
               <div className="flex items-center gap-3 mb-8 text-navy text-2xl font-display">
                  <Layers size={22} className="text-accent-red" />
                  Synopsis
               </div>
               <p className="text-lg text-navy/70 leading-loose font-serif italic">{series.overview}</p>
            </section>
          )}

          {/* Retro Trailer Player */}
          {series?.has_trailer && series?.trailer_url && (
            <section className="bg-white border-[4px] border-navy p-8 shadow-[10px_10px_0px_#C8391A]">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-accent-red border-2 border-navy flex items-center justify-center text-white animate-pulse">
                        <Play size={14} fill="currentColor" />
                     </div>
                     <h3 className="text-xl font-display text-navy uppercase tracking-widest">NOW SCREENING</h3>
                  </div>
                  <div className="text-[10px] font-black text-navy/40 uppercase tracking-[0.3em]">Projection Booth B</div>
               </div>

               <div className="relative aspect-video bg-navy border-[8px] border-cream shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] overflow-hidden group">
                  <iframe 
                    src={series.trailer_url.replace('watch?v=', 'embed/')} 
                    title={`${series.title} Trailer`}
                    className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 pointer-events-none border-[2px] border-navy/10" />
                  <div className="absolute inset-0 pointer-events-none halftone opacity-10" />
               </div>

               <div className="mt-6 flex items-center justify-between">
                  <h4 className="text-2xl font-display text-navy uppercase tracking-tighter">{series.title} <span className="text-accent-red">Trailer</span></h4>
                  <div className="flex items-center gap-4">
                     <div className="w-3 h-3 rounded-full bg-accent-red shadow-[0_0_10px_#C8391A]" />
                     <span className="text-[10px] font-black text-navy uppercase tracking-widest">Broadcasting</span>
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
          <div className="bg-white border-[4px] border-navy p-10 space-y-10 shadow-[10px_10px_0px_#C8391A] sticky top-24">
             <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-display text-navy mb-8">
                  {series?.type === 'anime' ? 'Anime Details' : 'Series Details'}
                </h3>
                <div className="space-y-0">
                  <div className="flex justify-between items-center py-4 border-b-2 border-navy/10">
                     <span className="text-navy/40 text-[11px] font-black uppercase tracking-widest">★ AI Rating</span>
                     <span className="font-display text-navy text-2xl">{displayRating(series?.rating)}<span className="text-sm opacity-30">/10</span></span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b-2 border-navy/10">
                     <span className="text-navy/40 text-[11px] font-black uppercase tracking-widest">📺 Seasons</span>
                     <span className="text-navy font-black text-lg">{series?.total_seasons || 1} Seasons</span>
                  </div>
                  {series?.type === 'anime' ? (
                     <div className="flex justify-between items-center py-4 border-b-2 border-navy/10">
                        <span className="text-navy/40 text-[11px] font-black uppercase tracking-widest">🔢 Episodes</span>
                        <span className="text-navy font-black text-lg">{series?.episode_count || series?.number_of_episodes || 'N/A'}</span>
                     </div>
                   ) : (
                     <div className="flex justify-between items-center py-4 border-b-2 border-navy/10">
                        <span className="text-navy/40 text-[11px] font-black uppercase tracking-widest">⏱ Avg Episode</span>
                        <span className="text-navy font-black text-lg">
                          {series?.runtime ? `${series.runtime} min` : 'N/A'}
                        </span>
                     </div>
                   )}
                   <div className="flex justify-between items-center py-4 border-b-2 border-navy/10">
                      <span className="text-navy/40 text-[11px] font-black uppercase tracking-widest">
                        {series?.type === 'anime' ? '🌐 Language' : '📡 Status'}
                      </span>
                      <span className="text-navy font-black text-lg uppercase">
                        {series?.type === 'anime' 
                          ? (series?.original_language || series?.language || 'N/A')
                          : (series?.status || 'N/A')
                        }
                      </span>
                   </div>
                </div>
             </div>

             {validStreaming.length > 0 && (
               <div className="pt-8 border-t-[4px] border-double border-navy">
                  <div className="text-navy font-display text-xl flex items-center gap-3 mb-8 uppercase tracking-widest">
                     <Globe size={22} className="text-accent-red" />
                     Streaming On
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {Array.from(new Map(validStreaming.filter(s => s.name).map(s => [s.name, s])).values()).slice(0, 4).map((s, i) => (
                       <div key={i} className="px-4 py-3 border-2 border-navy bg-cream flex flex-col items-center gap-2 group cursor-pointer hover:bg-accent-gold transition-all text-center">
                          <img src={s.logo} alt={s.name} className="w-10 h-10 object-contain grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                          <span className="text-navy text-[10px] font-black uppercase tracking-widest leading-tight">
                            {s.name?.replace?.(' with ads', '')?.replace?.(' Amazon Channel', '') || 'Platform'}
                          </span>
                       </div>
                     ))}
                  </div>
               </div>
             )}

             <div className="flex flex-col gap-4">
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(series, series.type === 'anime' ? 'anime' : 'series'); }} className={clsx("w-full h-14 border-2 border-navy font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3", inWishlist ? "bg-accent-gold text-navy shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white text-navy shadow-[4px_4px_0px_#1A1A2E] hover:bg-cream active:shadow-none active:translate-x-[2px] active:translate-y-[2px]")}>
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                  {inWishlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
