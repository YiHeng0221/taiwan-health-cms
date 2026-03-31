import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  // Fetch published articles
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/articles?pageSize=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      articlePages = (data.items || []).map((article: { slug: string; createdAt: string }) => ({
        url: `${SITE_URL}/articles/${article.slug}`,
        lastModified: new Date(article.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Silently fail — static pages still get indexed
  }

  return [...staticPages, ...articlePages];
}
