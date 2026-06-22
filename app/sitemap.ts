import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const BASE_URL = 'https://www.calidad3a.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await client.fetch(
    `*[_type == "product"]{ "slug": slug.current, _updatedAt }`
  )

  const productUrls = productos.map((p: { slug: string; _updatedAt: string }) => ({
    url: `${BASE_URL}/producto/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/catalogo/ropa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/catalogo/complementos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/catalogo/electronica`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    ...productUrls,
    { url: `${BASE_URL}/aviso-legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}