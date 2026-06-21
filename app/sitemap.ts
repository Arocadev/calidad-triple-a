import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const productos = ['1', '2', '3', '4', '5', '6']

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
    ...productos.map(id => ({
      url: `https://calidad3a.com/producto/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: 'https://calidad3a.com/aviso-legal',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}