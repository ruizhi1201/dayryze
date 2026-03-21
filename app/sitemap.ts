import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://dayryze.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://dayryze.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://dayryze.com/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://dayryze.com/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
