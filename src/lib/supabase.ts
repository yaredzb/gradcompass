import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables or localStorage config
const STORAGE_KEY_CONFIG = 'gradsearch_supabase_config_v1';
const STORAGE_KEY_AUTH_USER = 'gradsearch_auth_user_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  return { url: '', anonKey: '' };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}

export function getStoredAuthUser(): { email: string; id: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return null;
}

export function setStoredAuthUser(user: { email: string; id: string } | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
  }
}
