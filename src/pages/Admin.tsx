import React, { useMemo, useState } from 'react';
import { runWebhookTest } from '../services/geminiService';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings, BarChart3, Database, ShieldAlert, Activity } from 'lucide-react';

const mostKey = (obj: Record<string, number> = {}) => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { watchedMovies, watchedSeries, watchlistMovies, watchlistSeries, removeLibraryItem } = useNavrasa();
  const [query, setQuery] = useState('trending today');
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [response, setResponse] = useState('');

  const stats = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_search_stats');
      return raw ? JSON.parse(raw) : { totalSearches: 0, genre: {}, language: {} };
    } catch (error) {
      console.error('Failed to read search stats', error);
      return { totalSearches: 0, genre: {}, language: {} };
    }
  }, []);
  
  const cache = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_api_cache');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to read cache', error);
      return [];
    }
  }, []);
  
  const recentCache = [...cache].slice(-5).reverse();
  const libraryItems = [
    ...watchedMovies.map((item) => ({ ...item, category: 'watched' as const })),
    ...watchedSeries.map((item) => ({ ...item, category: 'watched' as const })),
    ...watchlistMovies.map((item) => ({ ...item, category: 'watchlist' as const })),
    ...watchlistSeries.map((item) => ({ ...item, category: 'watchlist' as const })),
  ];

  return (
    <div className="min-h-screen bg-cream pb-20">
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
              Projection <span className="text-navy">Booth</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Technical Control</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Administrative Oversight & Logic</p>
        </div>
      </section>

      <div className="px-4 md:px-10 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Stats & Analytics */}
          <div className="space-y-8">
            <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#1A1A2E] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 starburst opacity-10 pointer-events-none" />
               <h3 className="text-3xl font-display text-navy mb-8 flex items-center gap-4">
                  <BarChart3 className="text-accent-red" />
                  Box Office Stats
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b-2 border-navy/5">
                     <span className="text-[11px] font-black uppercase tracking-widest text-navy/40">Total Admissions</span>
                     <span className="font-display text-2xl text-navy">{stats.totalSearches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b-2 border-navy/5">
                     <span className="text-[11px] font-black uppercase tracking-widest text-navy/40">Popular Genre</span>
                     <span className="font-black text-accent-red uppercase tracking-widest">{mostKey(stats.genre)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                     <span className="text-[11px] font-black uppercase tracking-widest text-navy/40">Primary Dialect</span>
                     <span className="font-black text-accent-gold uppercase tracking-widest">{mostKey(stats.language)}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#E8943A]">
               <h3 className="text-3xl font-display text-navy mb-8 flex items-center gap-4">
                  <Database className="text-accent-red" />
                  Film Log Viewer
               </h3>
               <div className="space-y-3">
                  {recentCache.map((entry: any, idx: number) => (
                    <div key={idx} className="text-[10px] font-black uppercase tracking-widest bg-cream/50 p-3 border-2 border-navy text-navy/60">
                      {entry.timestamp.split('T')[1].split('.')[0]} • {entry.endpoint.replace('https://', '')}
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Webhook & Safety */}
          <div className="space-y-8">
            <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#C8391A]">
               <h3 className="text-3xl font-display text-navy mb-8 flex items-center gap-4">
                  <Activity className="text-accent-red" />
                  Signal Tester
               </h3>
               <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <input 
                      value={query} 
                      onChange={(e) => setQuery(e.target.value)} 
                      className="vintage-input w-full"
                      placeholder="Input search signal..."
                    />
                    <div className="flex gap-4">
                      <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value as any)} 
                        className="bg-cream border-2 border-navy px-4 font-black uppercase text-[10px] tracking-widest outline-none"
                      >
                        <option value="movie">Feature Film</option>
                        <option value="series">Broadcast Series</option>
                      </select>
                      <button 
                        onClick={async () => setResponse(JSON.stringify(await runWebhookTest(query, type), null, 2))}
                        className="vintage-button flex-1 h-12"
                      >
                        Send Signal
                      </button>
                    </div>
                  </div>
                  <pre className="text-[10px] bg-navy text-accent-gold p-6 border-2 border-navy overflow-auto max-h-60 custom-scrollbar font-mono leading-relaxed">
                    {response || '// Waiting for signal response...'}
                  </pre>
               </div>
            </div>

            <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#1A1A2E] border-dashed">
               <h3 className="text-3xl font-display text-navy mb-8 flex items-center gap-4">
                  <ShieldAlert className="text-accent-red" />
                  Emergency Override
               </h3>
               <p className="text-navy/40 text-[11px] font-black uppercase tracking-widest mb-8">This action will incinerate all local records and restart the projector.</p>
               <button 
                className="w-full h-14 bg-accent-red text-white border-2 border-navy font-display tracking-[0.2em] shadow-[4px_4px_0px_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all" 
                onClick={() => { if(confirm('Incinerate archives?')) { localStorage.clear(); window.location.reload(); } }}
               >
                 Reset All Archives
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
