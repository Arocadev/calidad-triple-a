import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  const producto = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ name, brand, price, description }`,
    { slug: id }
  )

  if (!producto) return { title: 'Producto no encontrado' }

  return {
    title: `${producto.name} — ${producto.brand} | Calidad Triple A`,
    description: `${producto.description || ''} Solo ${producto.price}€. Calidad Triple A.`,
    openGraph: {
      title: `${producto.name} — ${producto.brand}`,
      description: `${producto.description || ''} Solo ${producto.price}€.`,
      url: `https://calidad3a.com/producto/${id}`,
      siteName: 'Calidad Triple A',
      locale: 'es_ES',
      type: 'website',
    },
  }
}

export default function ProductoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}