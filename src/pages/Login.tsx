import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Ticket, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import PreferredNameModal from '../components/PreferredNameModal';
import {
  isSupabaseConfigured,
  signInWithGoogle,
  getSupabaseSession,
  supabase,
} from '../services/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'email' | 'google' | null>(null);
  const [step, setStep] = useState<'login' | 'namePrompt'>('login');
  const [googleFallback, setGoogleFallback] = useState<string>('');
  const navigate = useNavigate();

  // Handle incoming OAuth callback, session detection, and error parsing
  useEffect(() => {
    // 1. Check for OAuth errors in URL query or hash (e.g. user cancelled Google login)
    const searchParams = new URLSearchParams(window.location.search);
    const hashString = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hashString);

    const errorDescription =
      searchParams.get('error_description') ||
      hashParams.get('error_description') ||
      searchParams.get('error') ||
      hashParams.get('error');

    if (errorDescription) {
      setOauthError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      // Clean up sensitive/ugly error params from browser address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. If Supabase is configured, check for existing or redirected session
    if (isSupabaseConfigured() && supabase) {
      getSupabaseSession().then((session) => {
        if (session?.user) {
          handleSuccessfulSupabaseAuth(
            session.user.email || '',
            session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
          );
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          handleSuccessfulSupabaseAuth(
            session.user.email || '',
            session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
          );
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } else {
      // If already logged in locally and name is saved, go to home
      const isAuth = localStorage.getItem('navrasa_session');
      const isNameSaved = localStorage.getItem('navrasa_name_saved') === 'true';
      if (isAuth && isNameSaved) {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSuccessfulSupabaseAuth = (userEmail: string, googleDisplayName: string) => {
    localStorage.setItem('navrasa_session', 'active');
    if (userEmail) localStorage.setItem('user_email', userEmail);
    localStorage.setItem('auth_provider', 'google');

    // Clean address bar if tokens or code exist
    if (window.location.search || window.location.hash) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Fallback for Skip option
    const fallback =
      googleDisplayName || (userEmail.includes('@') ? userEmail.split('@')[0] : 'Viewer');
    setGoogleFallback(fallback);

    // If user has already saved their preferred name, proceed to home
    const isNameSaved = localStorage.getItem('navrasa_name_saved') === 'true';
    if (isNameSaved) {
      navigate('/');
    } else {
      // Step 2 onboarding: pre-fills nothing from Google
      setStep('namePrompt');
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!trimmedEmail.includes('@') || trimmedEmail.length < 5) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError(null);
    setOauthError(null);
    setIsLoading(true);
    setLoadingProvider('email');

    setTimeout(() => {
      localStorage.setItem('navrasa_session', 'active');
      localStorage.setItem('user_email', trimmedEmail);
      localStorage.setItem('auth_provider', 'email');

      setIsLoading(false);
      setLoadingProvider(null);

      // Check if this user already completed name onboarding previously
      const isNameSaved = localStorage.getItem('navrasa_name_saved') === 'true';
      if (isNameSaved) {
        navigate('/');
      } else {
        setStep('namePrompt');
      }
    }, 600);
  };

  const handleGoogleLogin = async () => {
    setEmailError(null);
    setOauthError(null);

    // If Supabase is not configured yet, notify user with clear instructions
    if (!isSupabaseConfigured()) {
      setOauthError(
        'Supabase credentials pending. Please enter your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file.'
      );
      return;
    }

    setIsLoading(true);
    setLoadingProvider('google');

    const { error, isRedirecting } = await signInWithGoogle();

    if (error) {
      setIsLoading(false);
      setLoadingProvider(null);
      setOauthError(error.message || 'Failed to initiate Google sign-in.');
      return;
    }

    if (!isRedirecting) {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleNameComplete = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cream py-16">
      {/* Retro Starburst Background */}
      <div className="absolute inset-0 starburst opacity-20 pointer-events-none" />
      <div className="absolute inset-0 halftone opacity-5 pointer-events-none" />

      {/* Marquee Header */}
      <div className="absolute top-0 w-full bg-navy py-4 border-b-[6px] border-double border-accent-gold overflow-hidden z-20">
        <div className="animate-marquee whitespace-nowrap flex gap-20">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-accent-gold font-display text-2xl tracking-[0.3em] uppercase">
              ★ Navarasa AI Cinema ★ Now Playing ★ Welcome ★
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-6 mt-16 md:mt-20">
        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <motion.div
              key="login-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
            >
              {/* Ticket Booth Card */}
              <div className="bg-white border-[6px] border-navy shadow-[12px_12px_0px_#C8391A] relative overflow-hidden">
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-r-2 border-b-2 border-navy opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-navy opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-navy opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-l-2 border-t-2 border-navy opacity-20 pointer-events-none" />

                {/* Marquee Title Block */}
                <div className="bg-accent-red border-b-[4px] border-navy p-6 text-center">
                  <div className="inline-block border-2 border-white px-4 py-1 mb-2">
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">Admit One</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display text-white tracking-tighter drop-shadow-[2px_2px_0px_#1A1A2E]">
                    SIGN IN
                  </h1>
                </div>

                <div className="p-8 md:p-10">
                  {/* OAuth Error Alert */}
                  {oauthError && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-accent-red text-navy text-xs rounded-none shadow-[2px_2px_0px_#C8391A]">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-bold text-accent-red">{oauthError}</p>
                          {!isSupabaseConfigured() && (
                            <p className="text-[11px] text-navy/70 font-sans leading-relaxed">
                              Open your project’s <code>.env</code> file and configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOauthError(null)}
                          className="text-navy/50 hover:text-navy text-xs font-black uppercase ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div className="space-y-2">
                      <label 
                        htmlFor="login-email-input" 
                        className="text-[11px] font-black uppercase tracking-widest text-navy ml-1"
                      >
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy/40 group-focus-within:text-accent-red transition-colors">
                          <Mail size={18} />
                        </div>
                        <input 
                          id="login-email-input"
                          type="email" 
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          placeholder="name@example.com" 
                          className={clsx(
                            "vintage-input w-full pl-12 text-base font-bold text-navy",
                            emailError && "border-accent-red"
                          )}
                        />
                      </div>
                      {emailError && (
                        <p className="text-accent-red text-xs font-bold mt-1 ml-1 flex items-center gap-1">
                          <span>⚠️</span> <span>{emailError}</span>
                        </p>
                      )}
                    </div>

                    {/* Action buttons: "Continue with Google" button next to existing login option */}
                    <div className="pt-2 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                        {/* Existing login option */}
                        <button 
                          id="email-login-button"
                          type="submit" 
                          disabled={isLoading}
                          className={clsx(
                            "vintage-button flex-1 h-14 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer",
                            isLoading && "opacity-80 cursor-not-allowed"
                          )}
                        >
                          {isLoading && loadingProvider === 'email' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span className="text-sm">Verifying...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Ticket size={20} className="rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                              <span className="text-lg">ENTER</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>

                        {/* Continue with Google button next to existing login option */}
                        <button 
                          id="google-login-button"
                          type="button" 
                          onClick={handleGoogleLogin}
                          disabled={isLoading}
                          className={clsx(
                            "bg-white hover:bg-cream text-navy border-[3px] border-navy font-display uppercase tracking-wider px-3 py-2 h-14 flex-1 flex items-center justify-center gap-2 shadow-[3px_3px_0px_#1A1A2E] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer",
                            isLoading && "opacity-80 cursor-not-allowed"
                          )}
                        >
                          {isLoading && loadingProvider === 'google' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                              <span className="text-xs font-sans font-bold normal-case">Connecting to Google...</span>
                            </div>
                          ) : (
                            <>
                              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                              </svg>
                              <span className="text-xs font-sans font-bold normal-case tracking-normal">
                                Continue with Google
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer Decoration */}
                <div className="bg-cream border-t-[4px] border-navy p-4 flex justify-between px-8">
                  <span className="text-[10px] font-black text-navy/40 uppercase">AI Cinema Guide</span>
                  <span className="text-[10px] font-black text-navy/40">BOX OFFICE</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="name-prompt-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
            >
              <PreferredNameModal
                isModal={false}
                onComplete={handleNameComplete}
                emailFallback={email}
                googleNameFallback={googleFallback}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Decorative Elements */}
        <div className="mt-10 flex items-center justify-center gap-8">
          <div className="w-12 h-[2px] bg-navy/20" />
          <div className="text-navy opacity-40 animate-flash">
            <span className="text-2xl">✦</span>
          </div>
          <div className="w-12 h-[2px] bg-navy/20" />
        </div>
      </div>

      {/* Marquee Footer */}
      <div className="absolute bottom-0 w-full bg-accent-gold py-3 border-t-[6px] border-double border-navy overflow-hidden z-20">
        <div className="animate-marquee whitespace-nowrap flex gap-20" style={{ animationDirection: 'reverse' }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-navy font-display text-lg tracking-[0.2em] uppercase">
              • Premiere Show • Limited Engagement • AI Curated • Cinematic Bliss •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
