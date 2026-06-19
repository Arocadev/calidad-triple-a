'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconShirt, IconSunglasses, IconHeadphones, IconShoe, IconDeviceWatch } from '@tabler/icons-react'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'
import SkeletonCard from '@/app/components/SkeletonCard'

const CATEGORIAS = ['Todo', 'Zapatillas', 'Camisetas', 'Gorras', 'Complementos', 'Electrónica']
const GENEROS = ['Todo', 'Masculino', 'Femenino']

const productos = [
  { id: '1', nombre: 'Air Max 90', marca: 'Nike', precio: 89, categoria: 'Zapatillas', genero: 'Masculino', tallas: ['39', '40', '41', '42', '43', '44'], badge: 'Destacado' as string | null, icon: <IconShoe size={36} stroke={1.5} color="#bbb" /> },
  { id: '2', nombre: 'Camiseta Essential', marca: 'Adidas', precio: 24, categoria: 'Camisetas', genero: 'Unisex', tallas: ['XS', 'S', 'M', 'L', 'XL'], badge: 'Nuevo' as string | null, icon: <IconShirt size={36} stroke={1.5} color="#bbb" /> },
  { id: '3', nombre: 'Auriculares BT', marca: 'JBL', precio: 45, categoria: 'Electrónica', genero: 'Unisex', tallas: ['Única'], badge: null, icon: <IconHeadphones size={36} stroke={1.5} color="#bbb" /> },
  { id: '4', nombre: 'Gorra Snapback', marca: 'New Era', precio: 32, categoria: 'Gorras', genero: 'Masculino', tallas: ['Única'], badge: 'Nuevo' as string | null, icon: <span style={{fontSize:'36px'}}>🧢</span> },
  { id: '5', nombre: 'Gafas de sol', marca: 'Ray-Ban', precio: 55, categoria: 'Complementos', genero: 'Unisex', tallas: ['Única'], badge: null, icon: <IconSunglasses size={36} stroke={1.5} color="#bbb" /> },
  { id: '6', nombre: 'Reloj deportivo', marca: 'Casio', precio: 38, categoria: 'Electrónica', genero: 'Masculino', tallas: ['Única'], badge: 'Destacado' as string | null, icon: <IconDeviceWatch size={36} stroke={1.5} color="#bbb" /> },
]

export default function Catalogo() {
  const [categoria, setCategoria] = useState('Todo')
  const [genero, setGenero] = useState('Todo')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('')
  const [filtroAbierto, setFiltroAbierto] = useState(false)
  const [tallasAbiertas, setTallasAbiertas] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [cargando, setCargando] = useState(true)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 800)
    return () => clearTimeout(t)
  }, [])

  const filtrados = productos
    .filter(p => {
      const matchCat = categoria === 'Todo' || p.categoria === categoria
      const matchGen = genero === 'Todo' || p.genero === genero || p.genero === 'Unisex'
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase())
      return matchCat && matchGen && matchBusqueda
    })
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio
      if (orden === 'precio-desc') return b.precio - a.precio
      return 0
    })

  const handleAnadir = (p: typeof productos[0], talla: string) => {
    addItem({
      id: p.id,
      name: p.nombre,
      brand: p.marca,
      price: p.precio,
      size: talla,
      quantity: 1,
    })
    setTallasAbiertas(null)
    setToastMsg(`${p.nombre} añadido`)
    setToastVisible(prev => !prev)
  }

  const btnOrden = (valor: string, label: string) => (
    <button
      onClick={() => setOrden(orden === valor ? '' : valor)}
      style={{
        background: orden === valor ? '#111' : '#fff',
        color: orden === valor ? '#FFD600' : '#666',
        border: `1.5px solid ${orden === valor ? '#111' : '#e5e5e5'}`,
        borderRadius: '4px',
        padding: '8px 14px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >{label}</button>
  )

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: '28px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Catálogo
          <span style={{ color: '#999', fontWeight: 400, fontSize: '16px', marginLeft: '10px' }}>
            {filtrados.length} productos
          </span>
        </h1>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{
              border: '1.5px solid #e5e5e5',
              borderRadius: '4px',
              padding: '8px 14px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '14px',
              outline: 'none',
              width: '160px',
            }}
          />
          {btnOrden('precio-asc', 'Precio asc.')}
          {btnOrden('precio-desc', 'Precio desc.')}
          <button
            onClick={() => setFiltroAbierto(!filtroAbierto)}
            style={{
              background: filtroAbierto ? '#111' : '#fff',
              color: filtroAbierto ? '#FFD600' : '#111',
              border: '1.5px solid #111',
              borderRadius: '4px',
              padding: '8px 18px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            ⚙ Filtrar
          </button>
        </div>
      </div>

      {filtroAbierto && (
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          padding: '20px 24px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '10px',
            }}>Categoría</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORIAS.map(c => (
                <button key={c} onClick={() => setCategoria(c)} style={{
                  background: categoria === c ? '#111' : '#fff',
                  color: categoria === c ? '#FFD600' : '#666',
                  border: `1px solid ${categoria === c ? '#111' : '#ddd'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: '10px',
            }}>Género</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {GENEROS.map(g => (
                <button key={g} onClick={() => setGenero(g)} style={{
                  background: genero === g ? '#111' : '#fff',
                  color: genero === g ? '#FFD600' : '#666',
                  border: `1px solid ${genero === g ? '#111' : '#ddd'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}>{g}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        padding: '24px',
      }}>
        {cargando
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtrados.length === 0
            ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '48px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '18px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                No se encontraron productos
              </div>
            )
            : filtrados.map(p => (
              <div key={p.id} style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = tallasAbiertas === p.id ? '#FFD600' : '#e5e5e5')}
              >
                {p.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: p.badge === 'Nuevo' ? '#FFD600' : '#111',
                    color: p.badge === 'Nuevo' ? '#111' : '#FFD600',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 900,
                    fontSize: '11px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    zIndex: 1,
                  }}>{p.badge}</div>
                )}

                <Link href={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#f5f5f5',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {p.icon}
                  </div>
                </Link>
                <div style={{ padding: '12px' }}>
                  <Link href={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      color: '#999',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}>{p.marca}</div>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontWeight: 700,
                      fontSize: '17px',
                      color: '#111',
                      marginBottom: '10px',
                    }}>{p.nombre}</div>
                  </Link>

                  {tallasAbiertas === p.id ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '2px',
                          color: '#999',
                          textTransform: 'uppercase',
                          margin: 0,
                        }}>Elige talla</p>
                        <button onClick={() => setTallasAbiertas(null)} style={{
                          background: 'none',
                          border: 'none',
                          color: '#bbb',
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: 0,
                          lineHeight: 1,
                        }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.tallas.map(t => (
                          <button key={t} onClick={() => handleAnadir(p, t)} style={{
                            background: '#111',
                            color: '#FFD600',
                            border: 'none',
                            borderRadius: '3px',
                            fontFamily: 'Barlow Condensed, sans-serif',
                            fontWeight: 700,
                            fontSize: '12px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 900,
                        fontSize: '22px',
                        color: '#111',
                      }}>{p.precio}€</span>
                      <button onClick={() => setTallasAbiertas(p.id)} style={{
                        background: '#111',
                        color: '#FFD600',
                        border: 'none',
                        borderRadius: '3px',
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 900,
                        fontSize: '12px',
                        letterSpacing: '1px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}>+ Añadir</button>
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