'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'
import SkeletonCard from '@/app/components/SkeletonCard'

const SUBCATEGORIAS = ['Todo', 'Auriculares', 'Relojes', 'Gadgets', 'Accesorios']

interface SanityProduct {
  _id: string
  name: string
  slug: { current: string }
  price: number
  brand: string
  subCategory: string
  gender: string
  badge: string
  images: any[]
  sizes: { size: string; stock: number }[]
}

const subCatLabel: Record<string, string> = {
  auriculares: 'Auriculares', relojes: 'Relojes', gadgets: 'Gadgets', accesorios: 'Accesorios',
}

export default function CatalogoElectronica() {
  const [productos, setProductos] = useState<SanityProduct[]>([])
  const [subcategoria, setSubcategoria] = useState('Todo')
  const [genero, setGenero] = useState('Todo')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(false)
  const [tallasAbiertas, setTallasAbiertas] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [cargando, setCargando] = useState(true)
  const [precioMin, setPrecioMin] = useState(0)
  const [precioMax, setPrecioMax] = useState(500)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    const fetchProductos = async () => {
      const query = `*[_type == "product" && mainCategory == "electronica"]{
        _id, name, slug, price, brand, subCategory, gender, badge, images, sizes
      }`
      const data = await client.fetch(query)
      setProductos(data)
      setCargando(false)
    }
    fetchProductos()
  }, [])

  const filtrados = productos
    .filter(p => {
      const matchCat = subcategoria === 'Todo' || subCatLabel[p.subCategory] === subcategoria
      const matchGen = genero === 'Todo' || p.gender === genero.toLowerCase() || p.gender === 'unisex'
      const matchBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase()) || p.brand.toLowerCase().includes(busqueda.toLowerCase())
      const matchPrecio = p.price >= precioMin && p.price <= precioMax
      return matchCat && matchGen && matchBusqueda && matchPrecio
    })
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.price - b.price
      if (orden === 'precio-desc') return b.price - a.price
      return 0
    })

  const handleAnadir = (p: SanityProduct, talla: string) => {
    addItem({ id: p._id, name: p.name, brand: p.brand, price: p.price, size: talla, quantity: 1 })
    setTallasAbiertas(null)
    setToastMsg(`${p.name} añadido`)
    setToastVisible(prev => !prev)
  }

  const limpiarFiltros = () => {
    setSubcategoria('Todo')
    setGenero('Todo')
    setOrden('')
    setPrecioMin(0)
    setPrecioMax(500)
  }

  const btnStyle = (activo: boolean) => ({
    background: activo ? '#111' : 'transparent',
    color: activo ? '#FFD600' : '#555',
    border: `1px solid ${activo ? '#111' : '#e5e5e5'}`,
    borderRadius: '3px',
    padding: '4px 12px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  })

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/catalogo" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Catálogo</Link>
        <span style={{ color: '#ddd' }}>›</span>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>Electrónica</span>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Electrónica
          <span style={{ color: '#999', fontWeight: 400, fontSize: '14px', marginLeft: '8px' }}>{filtrados.length} productos</span>
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '6px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', outline: 'none', width: '140px' }} />
          <button onClick={() => setFiltroAbierto(!filtroAbierto)} style={{ background: filtroAbierto ? '#111' : '#fff', color: filtroAbierto ? '#FFD600' : '#111', border: '1px solid #111', borderRadius: '4px', padding: '6px 14px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>⚙ Filtrar</button>
        </div>
      </div>

      {filtroAbierto && (
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '20px 24px' }}>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Ordenar por</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[{ val: 'precio-asc', label: 'Precio: menor a mayor' }, { val: 'precio-desc', label: 'Precio: mayor a menor' }].map(o => (
                <button key={o.val} onClick={() => setOrden(orden === o.val ? '' : o.val)} style={btnStyle(orden === o.val)}>{o.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Precio</p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', color: '#999', display: 'block', marginBottom: '4px' }}>Mínimo</label>
                <input type="number" value={precioMin} onChange={e => setPrecioMin(Number(e.target.value))} placeholder="0" style={{ width: '100%', padding: '6px 10px', border: '1px solid #e5e5e5', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <span style={{ color: '#ddd', marginTop: '14px' }}>—</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', color: '#999', display: 'block', marginBottom: '4px' }}>Máximo</label>
                <input type="number" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} placeholder="500" style={{ width: '100%', padding: '6px 10px', border: '1px solid #e5e5e5', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Categoría</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {SUBCATEGORIAS.map(c => (
                <button key={c} onClick={() => setSubcategoria(c)} style={btnStyle(subcategoria === c)}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Género</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Todo', 'Hombre', 'Mujer'].map(g => (
                <button key={g} onClick={() => setGenero(g)} style={btnStyle(genero === g)}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f0f0f0' }}>
            <button onClick={limpiarFiltros} style={{ background: 'none', border: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>Limpiar filtros</button>
            <button onClick={() => setFiltroAbierto(false)} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer' }}>Ver {filtrados.length} resultados</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', padding: '20px 24px' }}>
        {cargando
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtrados.length === 0
            ? <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '16px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>No se encontraron productos</div>
            : filtrados.map(p => (
              <div key={p._id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
              >
                {p.badge && p.badge !== 'none' && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: p.badge === 'nuevo' ? '#FFD600' : '#111', color: p.badge === 'nuevo' ? '#111' : '#FFD600', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', zIndex: 1 }}>{p.badge}</div>
                )}
                <Link href={`/producto/${p.slug.current}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f5f5f5', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.images?.[0] ? (
                      <img src={urlFor(p.images[0]).width(300).height(300).url()} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                    ) : (
                      <span style={{ color: '#bbb', fontSize: '12px' }}>Sin imagen</span>
                    )}
                  </div>
                </Link>
                <div style={{ padding: '10px' }}>
                  <Link href={`/producto/${p.slug.current}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{p.brand}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '8px' }}>{p.name}</div>
                  </Link>
                  {tallasAbiertas === p._id ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', margin: 0 }}>Talla</p>
                        <button onClick={() => setTallasAbiertas(null)} style={{ background: 'none', border: 'none', color: '#bbb', fontSize: '14px', cursor: 'pointer', padding: 0 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {p.sizes?.filter(s => s.stock > 0).map(s => (
                          <button key={s.size} onClick={() => handleAnadir(p, s.size)} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '3px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}>{s.size}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '18px', color: '#111' }}>{p.price}€</span>
                      <button onClick={() => setTallasAbiertas(p._id)} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '3px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '11px', letterSpacing: '1px', padding: '5px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>+ Añadir</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
      <Toast mensaje={toastMsg} visible={toastVisible} />
    </div>
  )
}