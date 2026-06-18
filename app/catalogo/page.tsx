'use client'

import { useState, useEffect } from 'react'
import { IconShirt, IconSunglasses, IconHeadphones, IconShoe, IconDeviceWatch } from '@tabler/icons-react'
import { useCartStore } from '@/store/cartStore'
import Toast from '@/app/components/Toast'
import SkeletonCard from '@/app/components/SkeletonCard'

const CATEGORIAS = ['Todo', 'Zapatillas', 'Camisetas', 'Gorras', 'Complementos', 'Electrónica']
const GENEROS = ['Todo', 'Masculino', 'Femenino']

const productos = [
  { id: '1', nombre: 'Air Max 90', marca: 'Nike', precio: 89, categoria: 'Zapatillas', genero: 'Masculino', tallas: ['39', '40', '41', '42', '43', '44'], icon: <IconShoe size={36} stroke={1.5} color="#bbb" /> },
  { id: '2', nombre: 'Camiseta Essential', marca: 'Adidas', precio: 24, categoria: 'Camisetas', genero: 'Unisex', tallas: ['XS', 'S', 'M', 'L', 'XL'], icon: <IconShirt size={36} stroke={1.5} color="#bbb" /> },
  { id: '3', nombre: 'Auriculares BT', marca: 'JBL', precio: 45, categoria: 'Electrónica', genero: 'Unisex', tallas: ['Única'], icon: <IconHeadphones size={36} stroke={1.5} color="#bbb" /> },
  { id: '4', nombre: 'Gorra Snapback', marca: 'New Era', precio: 32, categoria: 'Gorras', genero: 'Masculino', tallas: ['Única'], icon: <span style={{fontSize:'36px'}}>🧢</span> },
  { id: '5', nombre: 'Gafas de sol', marca: 'Ray-Ban', precio: 55, categoria: 'Complementos', genero: 'Unisex', tallas: ['Única'], icon: <IconSunglasses size={36} stroke={1.5} color="#bbb" /> },
  { id: '6', nombre: 'Reloj deportivo', marca: 'Casio', precio: 38, categoria: 'Electrónica', genero: 'Masculino', tallas: ['Única'], icon: <IconDeviceWatch size={36} stroke={1.5} color="#bbb" /> },
]

export default function Catalogo() {
  const [categoria, setCategoria] = useState('Todo')
  const [genero, setGenero] = useState('Todo')
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

  const filtrados = productos.filter(p => {
    const matchCat = categoria === 'Todo' || p.categoria === categoria
    const matchGen = genero === 'Todo' || p.genero === genero || p.genero === 'Unisex'
    return matchCat && matchGen
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

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
            <div style={{
              background: '#f5f5f5',
              height: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {p.icon}
            </div>
            <div style={{ padding: '12px' }}>
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