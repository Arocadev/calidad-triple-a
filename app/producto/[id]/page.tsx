'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'

interface SanityProduct {
  _id: string
  name: string
  slug: { current: string }
  price: number
  brand: string
  description: string
  mainCategory: string
  subCategory: string
  gender: string
  images: any[]
  sizes: { size: string; stock: number }[]
}

const subCatLabel: Record<string, string> = {
  camisetas: 'Camisetas',
  pantalones_chandal_cortos: 'Pantalones chándal cortos',
  pantalones_chandal_largos: 'Pantalones chándal largos',
  vaqueros_cortos: 'Vaqueros cortos',
  vaqueros_largos: 'Vaqueros largos',
  calzoncillos: 'Calzoncillos',
  calcetines: 'Calcetines',
  conjuntos_deporte: 'Conjuntos deporte',
  conjuntos_chandal: 'Conjuntos chándal',
  camisetas_futbol: 'Camisetas de fútbol',
  chaquetas: 'Chaquetas',
  sudaderas: 'Sudaderas',
  zapatillas: 'Zapatillas',
  sandalias_chanclas: 'Sandalias y chanclas',
  carteras: 'Carteras',
  tarjeteros: 'Tarjeteros',
  gafas: 'Gafas de sol',
  gorras: 'Gorras',
  bolsos: 'Bolsos',
  bandoleras_rinoneras: 'Bandoleras y riñoneras',
  cinturones: 'Cinturones',
  relojes_joyeria: 'Relojes y joyería',
  altavoz: 'Altavoz',
  auriculares: 'Auriculares inalámbricos',
  reloj_inteligente: 'Reloj inteligente',
  bases_carga: 'Bases de carga',
  fundas_movil: 'Fundas de móvil',
}

export default function Producto() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const [producto, setProducto] = useState<SanityProduct | null>(null)
  const [relacionados, setRelacionados] = useState<SanityProduct[]>([])
  const [cargando, setCargando] = useState(true)
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    const fetchProducto = async () => {
      const query = `*[_type == "product" && slug.current == $slug][0]{
        _id, name, slug, price, brand, description, mainCategory, subCategory, gender, images, sizes
      }`
      const data = await client.fetch(query, { slug: id })
      setProducto(data)
      setImagenActiva(0)

      if (data) {
        const relQuery = `*[_type == "product" && mainCategory == $cat && _id != $id][0...3]{
          _id, name, slug, price, brand, images
        }`
        const relData = await client.fetch(relQuery, { cat: data.mainCategory, id: data._id })
        setRelacionados(relData)
      }
      setCargando(false)
    }
    fetchProducto()
  }, [id])

  useEffect(() => {
    if (!cargando && !producto) {
      router.push('/catalogo')
    }
  }, [cargando, producto, router])

  if (cargando) {
    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: '#999' }}>Cargando...</p>
      </div>
    )
  }

  if (!producto) return null

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `👀 Mira este producto en Calidad Triple A:\n\n👕 ${producto.name} — ${producto.brand}\n💰 ${producto.price}€\n\n🔗 calidadtriplea.com/producto/${producto.slug.current}`
  )}`

  const handleAnadir = () => {
    if (!tallaSeleccionada) return
    addItem({ id: producto._id, name: producto.name, brand: producto.brand, price: producto.price, size: tallaSeleccionada, quantity: 1 })
    setToastMsg(`${producto.name} añadido`)
    setToastVisible(prev => !prev)
  }

  const tieneVariasImagenes = producto.images && producto.images.length > 1

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Inicio</Link>
        <span style={{ color: '#ddd', fontSize: '13px' }}>›</span>
        <Link href={`/catalogo/${producto.mainCategory}`} style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Catálogo</Link>
        <span style={{ color: '#ddd', fontSize: '13px' }}>›</span>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>{producto.name}</span>
      </div>

      <div className="producto-grid" style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

        <div>
          <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px', overflow: 'hidden' }}>
            {producto.images?.[imagenActiva] ? (
              <img src={urlFor(producto.images[imagenActiva]).width(600).url()} alt={producto.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
            ) : (
              <span style={{ color: '#bbb' }}>Sin imagen</span>
            )}
          </div>

          {tieneVariasImagenes && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {producto.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  style={{
                    width: '64px',
                    height: '64px',
                    padding: 0,
                    background: '#fff',
                    border: `2px solid ${imagenActiva === i ? '#FFD600' : '#e5e5e5'}`,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <img src={urlFor(img).width(120).height(120).url()} alt={`${producto.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '3px', color: '#999', textTransform: 'uppercase', marginBottom: '6px' }}>
              {producto.brand} · {subCatLabel[producto.subCategory]}
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '42px', color: '#111', letterSpacing: '-1px', margin: 0, lineHeight: 1 }}>{producto.name}</h1>
          </div>

          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '48px', color: '#111', lineHeight: 1 }}>{producto.price}€</div>

          <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '15px', color: '#666', lineHeight: 1.7, margin: 0 }}>{producto.description}</p>

          <div>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Elige tu talla</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {producto.sizes?.filter(s => s.stock > 0).map(s => (
                <button key={s.size} onClick={() => setTallaSeleccionada(s.size)} style={{
                  background: tallaSeleccionada === s.size ? '#111' : '#fff',
                  color: tallaSeleccionada === s.size ? '#FFD600' : '#111',
                  border: `2px solid ${tallaSeleccionada === s.size ? '#111' : '#e5e5e5'}`,
                  borderRadius: '4px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  minWidth: '52px',
                  textAlign: 'center',
                }}>{s.size}</button>
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
            {tallaSeleccionada ? `Añadir al carrito — ${producto.price}€` : 'Selecciona una talla'}
          </button>

          <button
            onClick={() => router.push('/carrito')}
            style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '2px', textTransform: 'uppercase', padding: '12px', cursor: 'pointer', width: '100%' }}
          >
            Ver carrito
          </button>

          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '2px', textTransform: 'uppercase', padding: '12px', cursor: 'pointer', width: '100%' }}
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
              <Link href={`/producto/${p.slug.current}`} key={p._id} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                >
                  <div style={{ background: '#f5f5f5', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.images?.[0] ? (
                      <img src={urlFor(p.images[0]).width(200).height(200).url()} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                    ) : (
                      <span style={{ color: '#bbb', fontSize: '11px' }}>Sin imagen</span>
                    )}
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{p.brand}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '6px' }}>{p.name}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '18px', color: '#111' }}>{p.price}€</div>
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