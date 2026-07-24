import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PreferencePanel from './PreferencePanel';
import { useNavrasa } from '../context/NavrasaContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, error, setError } = useNavrasa();
  const location = useLocation();

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-cream text-navy font-sans selection:bg-accent-red selection:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen relative">
        <TopBar onOpenPrefs={() => setIsPrefsOpen(true)} onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 pb-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.3 }}
            >
              <Outlet key={location.pathname} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Preference Panel */}
        <PreferencePanel isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />

        {/* Retro Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy z-[100] flex flex-col items-center justify-center overflow-hidden"
            >
               <div className="absolute inset-0 starburst opacity-20 animate-slow-rotate" />
               <div className="relative flex flex-col items-center justify-center z-10">
                  <div className="w-32 h-32 border-[8px] border-double border-accent-gold border-t-accent-red rounded-full animate-spin mb-10 shadow-[0_0_30px_rgba(200,57,26,0.3)]" />
                  
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-display text-white tracking-tighter drop-shadow-lg">
                      NAVARASA <span className="text-accent-red">AI</span>
                    </h2>
                    <p className="text-accent-gold text-[11px] font-black uppercase tracking-[0.4em] animate-flash">
                      ★ LOADING With your preferences... ★
                    </p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Toast */}
        <AnimatePresence>
           {error && (
             <motion.div 
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: 100, opacity: 0 }}
               className="fixed bottom-10 right-10 z-[110] bg-white border-[4px] border-navy p-6 shadow-[8px_8px_0px_#C8391A] max-w-sm"
             >
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-accent-red border-2 border-navy flex items-center justify-center text-white flex-shrink-0">
                      <Star size={20} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40">Technical Error</h4>
                      <p className="text-sm font-bold text-navy">{error}</p>
                      <button onClick={() => setError(null)} className="text-accent-red text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Dismiss</button>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      {isSidebarOpen && (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
