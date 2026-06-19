'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { IconShirt, IconSunglasses, IconHeadphones, IconShoe, IconDeviceWatch } from '@tabler/icons-react'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'

const productos = [
  { id: '1', nombre: 'Air Max 90', marca: 'Nike', precio: 89, categoria: 'Zapatillas', genero: 'Masculino', tallas: ['39', '40', '41', '42', '43', '44'], descripcion: 'Zapatillas clásicas de la firma Nike. Diseño icónico con suela de aire visible. Perfectas para el día a día.', icon: <IconShoe size={80} stroke={1} color="#ccc" />, iconSm: <IconShoe size={40} stroke={1} color="#ccc" /> },
  { id: '2', nombre: 'Camiseta Essential', marca: 'Adidas', precio: 24, categoria: 'Camisetas', genero: 'Unisex', tallas: ['XS', 'S', 'M', 'L', 'XL'], descripcion: 'Camiseta básica de algodón de alta calidad. Corte recto, disponible en varios colores. Ideal para cualquier ocasión.', icon: <IconShirt size={80} stroke={1} color="#ccc" />, iconSm: <IconShirt size={40} stroke={1} color="#ccc" /> },
  { id: '3', nombre: 'Auriculares BT', marca: 'JBL', precio: 45, categoria: 'Electrónica', genero: 'Unisex', tallas: ['Única'], descripcion: 'Auriculares inalámbricos con sonido premium. Batería de larga duración y conexión Bluetooth estable.', icon: <IconHeadphones size={80} stroke={1} color="#ccc" />, iconSm: <IconHeadphones size={40} stroke={1} color="#ccc" /> },
  { id: '4', nombre: 'Gorra Snapback', marca: 'New Era', precio: 32, categoria: 'Gorras', genero: 'Masculino', tallas: ['Única'], descripcion: 'Gorra snapback ajustable. Visera plana, bordado frontal. Talla única regulable.', icon: <span style={{fontSize:'80px'}}>🧢</span>, iconSm: <span style={{fontSize:'40px'}}>🧢</span> },
  { id: '5', nombre: 'Gafas de sol', marca: 'Ray-Ban', precio: 55, categoria: 'Complementos', genero: 'Unisex', tallas: ['Única'], descripcion: 'Gafas de sol con protección UV400. Montura ligera y resistente. Estilo clásico atemporal.', icon: <IconSunglasses size={80} stroke={1} color="#ccc" />, iconSm: <IconSunglasses size={40} stroke={1} color="#ccc" /> },
  { id: '6', nombre: 'Reloj deportivo', marca: 'Casio', precio: 38, categoria: 'Electrónica', genero: 'Masculino', tallas: ['Única'], descripcion: 'Reloj deportivo resistente al agua. Pantalla digital, cronómetro y alarma incluidos.', icon: <IconDeviceWatch size={80} stroke={1} color="#ccc" />, iconSm: <IconDeviceWatch size={40} stroke={1} color="#ccc" /> },
]

interface Producto {
  id: string
  nombre: string
  marca: string
  precio: number
  categoria: string
  genero: string
  tallas: string[]
  descripcion: string
  icon: React.ReactNode
  iconSm: React.ReactNode
}

export default function Producto() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const producto = productos.find(p => p.id === id) as Producto | undefined

  if (!producto) {
    router.push('/catalogo')
    return null
  }

  const relacionados = productos
    .filter(p => p.id !== producto.id && p.categoria === producto.categoria)
    .slice(0, 3)
    .concat(productos.filter(p => p.id !== producto.id && p.categoria !== producto.categoria))
    .slice(0, 3)

  const handleAnadir = () => {
    if (!tallaSeleccionada) return
    addItem({
      id: producto.id,
      name: producto.nombre,
      brand: producto.marca,
      price: producto.precio,
      size: tallaSeleccionada,
      quantity: 1,
    })
    setToastMsg(`${producto.nombre} añadido`)
    setToastVisible(prev => !prev)
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `👀 Mira este producto en Calidad Triple A:\n\n👕 ${producto.nombre} — ${producto.marca}\n💰 ${producto.precio}€\n\n🔗 calidadtriplea.com/producto/${producto.id}`
  )}`

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Inicio</Link>
        <span style={{ color: '#ddd', fontSize: '13px' }}>›</span>
        <Link href="/catalogo" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Catálogo</Link>
        <span style={{ color: '#ddd', fontSize: '13px' }}>›</span>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>{producto.nombre}</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px' }}>
          {producto.icon}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '3px', color: '#999', textTransform: 'uppercase', marginBottom: '6px' }}>
              {producto.marca} · {producto.categoria}
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '42px', color: '#111', letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>
              {producto.nombre}
            </h1>
          </div>

          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '48px', color: '#111', lineHeight: 1 }}>
            {producto.precio}€
          </div>

          <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '15px', color: '#666', lineHeight: 1.7, margin: 0 }}>
            {producto.descripcion}
          </p>

          <div>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>
              Elige tu talla
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {producto.tallas.map(t => (
                <button
                  key={t}
                  onClick={() => setTallaSeleccionada(t)}
                  style={{
                    background: tallaSeleccionada === t ? '#111' : '#fff',
                    color: tallaSeleccionada === t ? '#FFD600' : '#111',
                    border: `2px solid ${tallaSeleccionada === t ? '#111' : '#e5e5e5'}`,
                    borderRadius: '4px',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    minWidth: '52px',
                    textAlign: 'center',
                  }}
                >{t}</button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnadir}
            disabled={!tallaSeleccionada}
            style={{
              background: !tallaSeleccionada ? '#e5e5e5' : '#FFD600',
              color: !tallaSeleccionada ? '#999' : '#111',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '18px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '16px',
              cursor: !tallaSeleccionada ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {tallaSeleccionada ? `Añadir al carrito — ${producto.precio}€` : 'Selecciona una talla'}
          </button>

          <button
            onClick={() => router.push('/carrito')}
            style={{
              background: '#111',
              color: '#FFD600',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '15px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '12px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Ver carrito
          </button>

          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '15px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '12px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.79.473 3.47 1.29 4.93L2 22l5.233-1.27A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.04-1.1l-.29-.17-3.007.73.755-2.93-.19-.3A7.955 7.955 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
            </svg>
            Compartir por WhatsApp
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '22px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            También te puede gustar
            <div style={{ flex: 1, height: '2px', background: '#FFD600' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {relacionados.map(p => (
              <Link href={`/producto/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                >
                  <div style={{ background: '#f5f5f5', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.iconSm}
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{p.marca}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '6px' }}>{p.nombre}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '18px', color: '#111' }}>{p.precio}€</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Toast mensaje={toastMsg} visible={toastVisible} />
    </div>
  )
}