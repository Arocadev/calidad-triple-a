import type { Metadata } from 'next'

const productos = [
  { id: '1', nombre: 'Air Max 90', marca: 'Nike', precio: 89, descripcion: 'Zapatillas clásicas de la firma Nike.' },
  { id: '2', nombre: 'Camiseta Essential', marca: 'Adidas', precio: 24, descripcion: 'Camiseta básica de algodón de alta calidad.' },
  { id: '3', nombre: 'Auriculares BT', marca: 'JBL', precio: 45, descripcion: 'Auriculares inalámbricos con sonido premium.' },
  { id: '4', nombre: 'Gorra Snapback', marca: 'New Era', precio: 32, descripcion: 'Gorra snapback ajustable. Visera plana.' },
  { id: '5', nombre: 'Gafas de sol', marca: 'Ray-Ban', precio: 55, descripcion: 'Gafas de sol con protección UV400.' },
  { id: '6', nombre: 'Reloj deportivo', marca: 'Casio', precio: 38, descripcion: 'Reloj deportivo resistente al agua.' },
]

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const producto = productos.find(p => p.id === params.id)

  if (!producto) return { title: 'Producto no encontrado' }

  return {
    title: `${producto.nombre} — ${producto.marca} | Calidad Triple A`,
    description: `${producto.descripcion} Solo ${producto.precio}€. Calidad Triple A.`,
    openGraph: {
      title: `${producto.nombre} — ${producto.marca}`,
      description: `${producto.descripcion} Solo ${producto.precio}€.`,
      url: `https://calidadtriplea.com/producto/${producto.id}`,
      siteName: 'Calidad Triple A',
      locale: 'es_ES',
      type: 'website',
    },
  }
}

export default function ProductoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}