import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getPersonDetails } from '../services/geminiService';
import { motion } from 'motion/react';
import { ArrowLeft, User, Star, Film } from 'lucide-react';

const PersonDetail: React.FC = () => {
  const { name = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const context = (searchParams.get('context') as 'movie' | 'series') || 'movie';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getPersonDetails(decodeURIComponent(name), context);
        setData(response);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name, context]);

  const items = useMemo(() => {
    const movies = (data?.movies || []).map((m: any) => ({ ...m, type: 'movie' }));
    const series = (data?.series || []).map((s: any) => ({ ...s, type: 'series' }));
    return [...movies, ...series];
  }, [data]);

  const bio = data?.biography || data?.overview || `No biography available for ${decodeURIComponent(name)}.`;

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
              Cinema <span className="text-navy">Star</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Artist Profile</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Spotlight on {decodeURIComponent(name)}</p>
        </div>
      </section>

      <div className="px-4 md:px-10 py-16">
        <button 
          onClick={() => navigate(-1)}
          className="mb-10 h-12 px-6 bg-white border-2 border-navy text-navy font-black uppercase tracking-widest text-[10px] hover:bg-accent-red hover:text-white transition-all shadow-[4px_4px_0px_#1A1A2E] flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Reel
        </button>

        {loading ? (
          <div className="text-center py-20 bg-white border-[4px] border-navy border-dashed max-w-2xl mx-auto">
             <div className="w-12 h-12 border-4 border-navy border-t-accent-red rounded-full animate-spin mx-auto mb-6" />
             <p className="text-navy font-display text-xl uppercase tracking-widest">Opening Archives...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-start">
               <div className="vintage-card aspect-[2/3] overflow-hidden">
                  <img src={data?.photo || items[0]?.poster || ''} className="w-full h-full object-cover grayscale-[0.2]" alt={name} />
                  <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
               </div>
               
               <div className="space-y-8">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-display text-navy mb-4">{decodeURIComponent(name)}</h2>
                    <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest text-navy/40">
                       <span className="bg-accent-gold/10 border border-navy/10 px-3 py-1 rounded">Born: {data?.birthday || 'N/A'}</span>
                       <span className="bg-accent-red/5 border border-navy/10 px-3 py-1 rounded">Craft: {data?.known_for_department || 'Acting'}</span>
                    </div>
                  </div>

                  <div className="bg-white border-[3px] border-navy p-8 shadow-[8px_8px_0px_#E8943A] relative">
                     <div className="absolute -top-4 -left-2 text-7xl font-display text-accent-red opacity-5">"</div>
                     <p className="text-lg text-navy/70 leading-loose font-serif italic relative z-10">
                       {expanded ? bio : `${bio}`.slice(0, 450)}{!expanded && bio.length > 450 ? '...' : ''}
                     </p>
                     {bio.length > 450 && (
                       <button className="text-accent-red font-black uppercase tracking-widest text-[10px] mt-6 hover:underline" onClick={() => setExpanded((v) => !v)}>
                         {expanded ? '★ Close File' : '★ Read Full Dossier'}
                       </button>
                     )}
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="flex items-center gap-6">
                  <h2 className="text-3xl md:text-5xl font-display text-navy whitespace-nowrap uppercase tracking-tighter">Filmography</h2>
                  <div className="h-[4px] flex-1 bg-navy" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                 {items.map((item: any, idx: number) => (
                   <div key={`${item.title}-${idx}`} className="group cursor-default">
                      <div className="vintage-card aspect-[2/3] overflow-hidden mb-4 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                        <img src={item.poster || ''} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt={item.title} />
                        <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
                      </div>
                      <div className="px-1">
                        <div className="text-[12px] font-black text-navy uppercase tracking-widest line-clamp-2 leading-tight mb-1">{item.title}</div>
                        <div className="text-[10px] font-black text-accent-red/60 uppercase tracking-widest">{item.year} • ★ {item.rating || 'N/A'}</div>
                        <div className="text-[9px] font-bold text-navy/30 uppercase tracking-widest mt-1 truncate">{item.character || 'Role N/A'}</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;
