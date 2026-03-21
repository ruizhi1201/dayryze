import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://dayryz.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://dayryz.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://dayryz.com/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://dayryz.com/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
