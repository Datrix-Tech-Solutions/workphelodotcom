import type { MetadataRoute } from 'next'

type Entry = {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

const routes: Entry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/jobs', changeFrequency: 'daily', priority: 0.9 },
  { path: '/products', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/post-job', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sign-in', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/sign-up', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/recruiter/sign-in', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/recruiter/sign-up', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://workphelo.com'
  const lastModified = new Date()

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
