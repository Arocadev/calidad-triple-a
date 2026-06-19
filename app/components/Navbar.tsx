'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const totalItems = useCartStore(state =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  )
  const [bounce, setBounce] = useState(false)
  const prevTotal = useRef(totalItems)

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBounce(true)
      setTimeout(() => setBounce(false), 400)
    }
    prevTotal.current = totalItems
  }, [totalItems])

  return (
    <nav style={{
      background: 'var(--negro)',
      borderBottom: '4px solid var(--amarillo)',
      padding: '0 32px',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img
          src="/logo.png"
          alt="Calidad Triple A"
          style={{ height: '58px', width: '220px', objectFit: 'contain' }}
        />
      </Link>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
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

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          transform: bounce ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.15s ease',
        }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: bounce ? 'rotate(-12deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
            }}
          >
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
      </div>
    </nav>
  )
}