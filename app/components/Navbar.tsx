'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const totalItems = useCartStore(state =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  )

  return (
    <nav style={{
      background: 'var(--negro)',
      borderBottom: '4px solid var(--amarillo)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '58px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 900,
        fontSize: '22px',
        letterSpacing: '1px',
        color: '#fff',
        textDecoration: 'none',
      }}>
        CALIDAD <span style={{ color: 'var(--amarillo)' }}>TRIPLE A</span>
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link href="/" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '2px',
          color: '#fff',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>Inicio</Link>
        <Link href="/catalogo" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '2px',
          color: '#fff',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>Catálogo</Link>
      </div>

      <Link href="/carrito" style={{
        background: 'var(--amarillo)',
        color: 'var(--negro)',
        borderRadius: '4px',
        padding: '7px 16px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 900,
        fontSize: '15px',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Carrito
        {totalItems > 0 && (
          <span style={{
            background: 'var(--negro)',
            color: 'var(--amarillo)',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>{totalItems}</span>
        )}
      </Link>
    </nav>
  )
}