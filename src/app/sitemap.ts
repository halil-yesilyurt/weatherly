import type { MetadataRoute } from 'next';

const siteUrl = 'https://weatherly.halilyesilyurt.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Weatherly is a single public route; shareable coordinates remain canonical to it.
  return [{ url: siteUrl }];
}
