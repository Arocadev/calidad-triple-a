import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await client.fetch(
    `*[_type == "product"]{ "slug": slug.current, _updatedAt }`
  )

  const productUrls = productos.map((p: { slug: string; _updatedAt: string }) => ({
    url: `https://calidad3a.com/producto/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://calidad3a.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://calidad3a.com/catalogo',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://calidad3a.com/catalogo/ropa',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: 'https://calidad3a.com/catalogo/complementos',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: 'https://calidad3a.com/catalogo/electronica',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...productUrls,
    {
      url: 'https://calidad3a.com/aviso-legal',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}