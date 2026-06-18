'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  mensaje: string
  visible: boolean
}

export default function Toast({ mensaje, visible }: ToastProps) {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    if (visible) {
      setMostrar(true)
      const t = setTimeout(() => setMostrar(false), 2500)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mostrar) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#111',
      color: '#FFD600',
      fontFamily: 'Barlow Condensed, sans-serif',
      fontWeight: 700,
      fontSize: '15px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '12px 24px',
      borderRadius: '4px',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap',
    }}>
      ✓ {mensaje}
    </div>
  )
}