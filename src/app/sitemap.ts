import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.dtsrinivas.com';
  const routes = ['', '/about', '/achievements', '/membership/join', '/teachers', '/grievances', '/events', '/news', '/volunteer', '/contact'];
  const now = new Date();
  return ['en', 'kn'].flatMap((loc) =>
    routes.map((r) => ({
      url: `${base}/${loc}${r}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: r === '' ? 1.0 : 0.7,
    }))
  );
}
