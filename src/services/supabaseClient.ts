import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Checks whether Supabase has been properly configured with valid non-placeholder credentials.
 */
export function isSupabaseConfigured(): boolean {
  if (!rawUrl || !rawAnonKey) return false;
  const cleanUrl = String(rawUrl).trim();
  const cleanKey = String(rawAnonKey).trim();

  if (
    cleanUrl === '' ||
    cleanKey === '' ||
    cleanUrl === 'YOUR_SUPABASE_PROJECT_URL' ||
    cleanKey === 'YOUR_SUPABASE_ANON_KEY' ||
    cleanUrl.includes('YOUR_SUPABASE') ||
    cleanKey.includes('YOUR_SUPABASE')
  ) {
    return false;
  }

  // Must be a valid URL
  try {
    const parsed = new URL(cleanUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabaseInstance = createClient(String(rawUrl).trim(), String(rawAnonKey).trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseInstance = null;
  }
}

export const supabase = supabaseInstance;

/**
 * Initiates Google OAuth authentication via Supabase.
 * Redirects user to Google OAuth consent screen.
 */
export async function signInWithGoogle(redirectTo?: string): Promise<{ error: Error | null; isRedirecting?: boolean }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      error: new Error(
        'Supabase is not configured yet. Please enter your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file.'
      ),
    };
  }

  try {
    const callbackUrl = redirectTo || `${window.location.origin}/login`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null, isRedirecting: true };
  } catch (err: any) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Sign out from Supabase auth session.
 */
export async function signOutFromSupabase(): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Retrieve the current active Supabase session if available.
 */
export async function getSupabaseSession(): Promise<Session | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.error('Error fetching Supabase session:', err);
    return null;
  }
}
