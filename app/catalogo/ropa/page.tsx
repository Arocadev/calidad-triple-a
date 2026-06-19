'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconShirt, IconShoe } from '@tabler/icons-react'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'
import SkeletonCard from '@/app/components/SkeletonCard'

const SUBCATEGORIAS = ['Todo', 'Zapatillas', 'Camisetas', 'Conjuntos', 'Pantalones']

const productos = [
  { id: '1', nombre: 'Air Max 90', marca: 'Nike', precio: 89, categoria: 'Zapatillas', genero: 'Masculino', tallas: ['39', '40', '41', '42', '43', '44'], badge: 'Destacado' as string | null, icon: <IconShoe size={36} stroke={1.5} color="#bbb" /> },
  { id: '2', nombre: 'Camiseta Essential', marca: 'Adidas', precio: 24, categoria: 'Camisetas', genero: 'Unisex', tallas: ['XS', 'S', 'M', 'L', 'XL'], badge: 'Nuevo' as string | null, icon: <IconShirt size={36} stroke={1.5} color="#bbb" /> },
]

export default function CatalogoRopa() {
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
    const t = setTimeout(() => setCargando(false), 800)
    return () => clearTimeout(t)
  }, [])

  const filtrados = productos
    .filter(p => {
      const matchCat = subcategoria === 'Todo' || p.categoria === subcategoria
      const matchGen = genero === 'Todo' || p.genero === genero || p.genero === 'Unisex'
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.marca.toLowerCase().includes(busqueda.toLowerCase())
      const matchPrecio = p.precio >= precioMin && p.precio <= precioMax
      return matchCat && matchGen && matchBusqueda && matchPrecio
    })
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio
      if (orden === 'precio-desc') return b.precio - a.precio
      return 0
    })

  const handleAnadir = (p: typeof productos[0], talla: string) => {
    addItem({ id: p.id, name: p.nombre, brand: p.marca, price: p.precio, size: talla, quantity: 1 })
    setTallasAbiertas(null)
    setToastMsg(`${p.nombre} añadido`)
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
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>Ropa</span>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Ropa
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
              <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
              >
                {p.badge && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: p.badge === 'Nuevo' ? '#FFD600' : '#111', color: p.badge === 'Nuevo' ? '#111' : '#FFD600', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '3px', zIndex: 1 }}>{p.badge}</div>
                )}
                <Link href={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f5f5f5', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.icon}</div>
                </Link>
                <div style={{ padding: '10px' }}>
                  <Link href={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{p.marca}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '8px' }}>{p.nombre}</div>
                  </Link>
                  {tallasAbiertas === p.id ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', margin: 0 }}>Talla</p>
                        <button onClick={() => setTallasAbiertas(null)} style={{ background: 'none', border: 'none', color: '#bbb', fontSize: '14px', cursor: 'pointer', padding: 0 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {p.tallas.map(t => (
                          <button key={t} onClick={() => handleAnadir(p, t)} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '3px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}>{t}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '18px', color: '#111' }}>{p.precio}€</span>
                      <button onClick={() => setTallasAbiertas(p.id)} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '3px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '11px', letterSpacing: '1px', padding: '5px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>+ Añadir</button>
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