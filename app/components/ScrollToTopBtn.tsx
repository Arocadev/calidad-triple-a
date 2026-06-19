'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#111',
        color: '#FFD600',
        border: 'none',
        borderRadius: '4px',
        width: '44px',
        height: '44px',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      ↑
    </button>
  )
}