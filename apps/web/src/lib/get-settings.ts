/**
 * @fileoverview Server-side settings fetcher
 *
 * Fetches site settings from the backend on the server.
 * Used by server components / generateMetadata for SEO-friendly rendering.
 * Includes in-memory cache with 60s TTL to avoid excessive API calls.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface SiteSettingsData {
  id: string;
  siteName: string;
  logo: string | null;
  favicon: string | null;
  footer: {
    copyright?: string;
    links?: { label: string; url: string }[];
  } | null;
  social: {
    facebook?: { name: string; url: string };
    instagram?: { name: string; url: string };
    line?: { name: string; url: string };
    youtube?: { name: string; url: string };
  } | null;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  } | null;
}

let cachedSettings: SiteSettingsData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

/**
 * Fetch site settings from backend (server-side, cached)
 */
export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  const now = Date.now();
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return cachedSettings;
    const data: SiteSettingsData = await res.json();
    cachedSettings = data;
    cacheTimestamp = now;
    return data;
  } catch {
    // Return stale cache or null if backend is down
    return cachedSettings;
  }
}
