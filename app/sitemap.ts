import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const productos = ['1', '2', '3', '4', '5', '6']

  return [
    {
      url: 'https://calidadtriplea.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://calidadtriplea.com/catalogo',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productos.map(id => ({
      url: `https://calidadtriplea.com/producto/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: 'https://calidadtriplea.com/aviso-legal',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}