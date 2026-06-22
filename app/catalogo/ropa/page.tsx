'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'
import SkeletonCard from '@/app/components/SkeletonCard'

const SUBCATEGORIAS = ['Todo', 'Camisetas', 'Pantalones chándal cortos', 'Pantalones chándal largos', 'Vaqueros cortos', 'Vaqueros largos', 'Calzoncillos', 'Calcetines', 'Conjuntos deporte', 'Conjuntos chándal', 'Camisetas de fútbol', 'Chaquetas', 'Sudaderas', 'Zapatillas', 'Sandalias y chanclas']

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
}

type Seccion = 'orden' | 'precio' | 'categoria' | 'genero' | 'marca' | 'talla' | null

export default function CatalogoRopa() {
  const [productos, setProductos] = useState<SanityProduct[]>([])
  const [subcategoria, setSubcategoria] = useState('Todo')
  const [genero, setGenero] = useState('Todo')
  const [marcasSel, setMarcasSel] = useState<string[]>([])
  const [tallasSel, setTallasSel] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(false)
  const [seccionAbierta, setSeccionAbierta] = useState<Seccion>(null)
  const [tallasAbiertas, setTallasAbiertas] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [cargando, setCargando] = useState(true)
  const [precioMin, setPrecioMin] = useState(0)
  const [precioMax, setPrecioMax] = useState(500)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    const fetchProductos = async () => {
      const query = `*[_type == "product" && mainCategory == "ropa"]{
        _id, name, slug, price, brand, subCategory, gender, badge, images, sizes
      }`
      const data = await client.fetch(query)
      setProductos(data)
      setCargando(false)
    }
    fetchProductos()
  }, [])

  const marcas = Array.from(new Set(productos.map(p => p.brand))).sort()
  const tallasDisponibles = Array.from(new Set(productos.flatMap(p => p.sizes?.map(s => s.size) || []))).sort()

  const toggleMarca = (m: string) => {
    setMarcasSel(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  const toggleTalla = (t: string) => {
    setTallasSel(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const filtrados = productos
    .filter(p => {
      const matchCat = subcategoria === 'Todo' || subCatLabel[p.subCategory] === subcategoria
      const matchGen = genero === 'Todo' || p.gender === genero.toLowerCase() || p.gender === 'unisex'
      const matchMarca = marcasSel.length === 0 || marcasSel.includes(p.brand)
      const matchTalla = tallasSel.length === 0 || p.sizes?.some(s => tallasSel.includes(s.size) && s.stock > 0)
      const matchBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase()) || p.brand.toLowerCase().includes(busqueda.toLowerCase())
      const matchPrecio = p.price >= precioMin && p.price <= precioMax
      return matchCat && matchGen && matchMarca && matchTalla && matchBusqueda && matchPrecio
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
    setMarcasSel([])
    setTallasSel([])
    setOrden('')
    setPrecioMin(0)
    setPrecioMax(500)
  }

  const cerrarFiltro = () => {
    setFiltroAbierto(false)
    setSeccionAbierta(null)
  }

  const toggleSeccion = (s: Seccion) => {
    setSeccionAbierta(prev => prev === s ? null : s)
  }

  const pillStyle = (activo: boolean) => ({
    background: activo ? '#111' : '#fff',
    color: activo ? '#FFD600' : '#333',
    border: `1px solid ${activo ? '#111' : '#e5e5e5'}`,
    borderRadius: '3px',
    padding: '7px 14px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  })

  const seccionHeaderStyle = {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: '16px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: '#111',
  }

  const renderFlecha = (seccion: Seccion) => (
    <span style={{
      display: 'inline-block',
      transform: seccionAbierta === seccion ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      fontSize: '12px',
      color: '#999',
    }}>▾</span>
  )

  const contadorFiltros = marcasSel.length + tallasSel.length + (genero !== 'Todo' ? 1 : 0) + (subcategoria !== 'Todo' ? 1 : 0)

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/catalogo" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', textDecoration: 'none' }}>Catálogo</Link>
        <span style={{ color: '#ddd' }}>›</span>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#111' }}>Ropa</span>
      </div>

      <div className="catalogo-header" style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Ropa
          <span style={{ color: '#999', fontWeight: 400, fontSize: '14px', marginLeft: '8px' }}>{filtrados.length} productos</span>
        </h1>
        <div className="catalogo-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="catalogo-search" style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '6px 12px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', outline: 'none', width: '140px' }} />
          <button onClick={() => setFiltroAbierto(true)} style={{ background: '#fff', color: '#111', border: '1px solid #111', borderRadius: '4px', padding: '6px 14px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Filtrar
            {contadorFiltros > 0 && (
              <span style={{ background: '#FFD600', color: '#111', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{contadorFiltros}</span>
            )}
          </button>
        </div>
      </div>

      {filtroAbierto && (
        <div onClick={cerrarFiltro} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 300,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '380px',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInLeft 0.25s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Filtros</h2>
              <button onClick={cerrarFiltro} style={{ background: 'none', border: 'none', fontSize: '22px', color: '#999', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('orden')}>
                Ordenar por
                {renderFlecha('orden')}
              </button>
              {seccionAbierta === 'orden' && (
                <div style={{ padding: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button onClick={() => setOrden(orden === 'precio-asc' ? '' : 'precio-asc')} style={pillStyle(orden === 'precio-asc')}>Precio ascendente</button>
                  <button onClick={() => setOrden(orden === 'precio-desc' ? '' : 'precio-desc')} style={pillStyle(orden === 'precio-desc')}>Precio descendente</button>
                </div>
              )}

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('precio')}>
                Precio
                {renderFlecha('precio')}
              </button>
              {seccionAbierta === 'precio' && (
                <div style={{ padding: '14px 0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={precioMin}
                    onChange={e => setPrecioMin(Number(e.target.value))}
                    placeholder="0"
                    style={{ width: '70px', padding: '8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', outline: 'none', textAlign: 'center' as const, boxSizing: 'border-box' as const }}
                  />
                  <span style={{ color: '#bbb' }}>—</span>
                  <input
                    type="number"
                    value={precioMax}
                    onChange={e => setPrecioMax(Number(e.target.value))}
                    placeholder="500"
                    style={{ width: '70px', padding: '8px', border: '1px solid #e5e5e5', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', outline: 'none', textAlign: 'center' as const, boxSizing: 'border-box' as const }}
                  />
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#999' }}>€</span>
                </div>
              )}

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('categoria')}>
                Categoría
                {renderFlecha('categoria')}
              </button>
              {seccionAbierta === 'categoria' && (
                <div style={{ padding: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SUBCATEGORIAS.map(c => (
                    <button key={c} onClick={() => setSubcategoria(c)} style={pillStyle(subcategoria === c)}>{c}</button>
                  ))}
                </div>
              )}

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('genero')}>
                Género
                {renderFlecha('genero')}
              </button>
              {seccionAbierta === 'genero' && (
                <div style={{ padding: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Todo', 'Hombre', 'Mujer', 'Unisex'].map(g => (
                    <button key={g} onClick={() => setGenero(g)} style={pillStyle(genero === g)}>{g}</button>
                  ))}
                </div>
              )}

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('talla')}>
                Talla
                {tallasSel.length > 0 && <span style={{ fontSize: '12px', color: '#999', fontWeight: 400 }}>{tallasSel.length} seleccionadas</span>}
                {renderFlecha('talla')}
              </button>
              {seccionAbierta === 'talla' && (
                <div style={{ padding: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tallasDisponibles.length === 0
                    ? <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#999' }}>Sin tallas disponibles</span>
                    : tallasDisponibles.map(t => (
                      <button key={t} onClick={() => toggleTalla(t)} style={pillStyle(tallasSel.includes(t))}>{t}</button>
                    ))}
                </div>
              )}

              <button style={seccionHeaderStyle} onClick={() => toggleSeccion('marca')}>
                Marca
                {marcasSel.length > 0 && <span style={{ fontSize: '12px', color: '#999', fontWeight: 400 }}>{marcasSel.length} seleccionadas</span>}
                {renderFlecha('marca')}
              </button>
              {seccionAbierta === 'marca' && (
                <div style={{ padding: '14px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {marcas.length === 0
                    ? <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#999' }}>Sin marcas disponibles</span>
                    : marcas.map(m => (
                      <button key={m} onClick={() => toggleMarca(m)} style={pillStyle(marcasSel.includes(m))}>{m}</button>
                    ))}
                </div>
              )}

            </div>

            <div style={{ display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid #eee' }}>
              <button onClick={limpiarFiltros} style={{ flex: 1, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', cursor: 'pointer', padding: '12px' }}>Limpiar</button>
              <button onClick={cerrarFiltro} style={{ flex: 2, background: '#111', color: '#FFD600', border: 'none', borderRadius: '4px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', padding: '12px' }}>Ver {filtrados.length} resultados</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="catalogo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', padding: '20px 40px', maxWidth: '1600px', margin: '0 auto' }}>
        {cargando
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtrados.length === 0
            ? <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '16px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>No se encontraron productos</div>
            : filtrados.map(p => (
              <div key={p._id} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
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
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Link href={`/producto/${p.slug.current}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#999', textTransform: 'uppercase', marginBottom: '2px' }}>{p.brand}</div>
                    <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '8px' }}>{p.name}</div>
                  </Link>
                  {tallasAbiertas === p._id ? (
                    <div style={{ marginTop: 'auto' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
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