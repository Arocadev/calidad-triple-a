'use client'

import Link from 'next/link'
import { IconShirt, IconSunglasses, IconHeadphones } from '@tabler/icons-react'

export default function Catalogo() {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
      }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(24px, 2.5vw, 36px)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: 0,
        }}>Catálogo</h1>
      </div>

      <div className="catalogo-hub-grid" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
        alignItems: 'stretch',
      }}>
        {[
          { href: '/catalogo/ropa', label: 'Ropa', sub: 'Zapatillas · Camisetas · Conjuntos · Pantalones', icon: <IconShirt size={64} stroke={1} color="#FFD600" /> },
          { href: '/catalogo/complementos', label: 'Complementos', sub: 'Gorras · Carteras · Bandoleras · Relojes · Gafas', icon: <IconSunglasses size={64} stroke={1} color="#FFD600" /> },
          { href: '/catalogo/electronica', label: 'Electrónica', sub: 'Auriculares · Gadgets · Accesorios · Móviles', icon: <IconHeadphones size={64} stroke={1} color="#FFD600" /> },
        ].map((cat, i) => (
          <Link key={i} href={cat.href} style={{ textDecoration: 'none', display: 'flex' }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '48px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                width: '100%',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#FFD600')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
            >
              <div style={{ background: '#111', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: 'clamp(20px, 2vw, 28px)', textTransform: 'uppercase', letterSpacing: '1px', color: '#111', marginBottom: '10px' }}>{cat.label}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 'clamp(12px, 1.1vw, 15px)', color: '#999', letterSpacing: '1px', lineHeight: 1.5 }}>{cat.sub}</div>
              </div>
              <div style={{ background: '#111', color: '#FFD600', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: 'clamp(12px, 1.1vw, 15px)', letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 24px', borderRadius: '4px', flexShrink: 0 }}>
                Ver productos →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}