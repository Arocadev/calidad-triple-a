import Link from 'next/link'
import { IconShirt, IconSunglasses, IconHeadphones, IconRosette, IconTruckDelivery, IconBrandWhatsapp } from '@tabler/icons-react'

export default function Home() {
  return (
    <>
      <section style={{
        background: 'var(--negro)',
        padding: '24px',
        textAlign: 'center',
        minHeight: 'calc(100vh - 280px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <img
          src="/logo-hero.png"
          alt="Calidad Triple A — Moda Urbana & Streetwear"
          className="hero-logo"
          style={{
            maxWidth: 'min(600px, 50vw)',
            width: '100%',
            height: 'auto',
            margin: '0 auto',
            display: 'block',
          }}
        />

        <div className="hero-bar" style={{
          width: '80px',
          height: '5px',
          background: 'var(--amarillo)',
          margin: '-20px auto 10px',
          borderRadius: '2px',
        }} />

        <p className="hero-sub" style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 'clamp(14px, 1.5vw, 22px)',
          color: '#777',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          La misma calidad, diferente precio
        </p>

        <div style={{ width: '100%' }}>
          <div className="hero-cats" style={{
            display: 'flex',
            width: '100%',
            maxWidth: 'min(700px, 60vw)',
            margin: '0 auto',
            borderTop: '2px solid #444',
          }}>
            {[
              { label: 'Ropa', href: '/catalogo/ropa', icon: <IconShirt size={32} stroke={1.5} color="#FFD600" /> },
              { label: 'Complementos', href: '/catalogo/complementos', icon: <IconSunglasses size={32} stroke={1.5} color="#FFD600" /> },
              { label: 'Electrónica', href: '/catalogo/electronica', icon: <IconHeadphones size={32} stroke={1.5} color="#FFD600" /> },
            ].map((cat, i) => (
              <Link href={cat.href} key={i} style={{
                flex: 1,
                padding: '24px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                borderRight: i < 2 ? '2px solid #444' : 'none',
                textDecoration: 'none',
              }}>
                {cat.icon}
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(12px, 1.2vw, 16px)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--amarillo)',
                  textAlign: 'center',
                }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="trust-bar">
        {[
          { text: 'Calidad AAA+', icon: <IconRosette size={18} stroke={1.8} color="#111" /> },
          { text: 'Envío rápido', icon: <IconTruckDelivery size={18} stroke={1.8} color="#111" /> },
          { text: 'Pedido por WhatsApp', icon: <IconBrandWhatsapp size={18} stroke={1.8} color="#111" /> },
        ].map((item, i) => (
          <div key={i} className="trust-bar-item">
            {item.icon}
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--negro)',
            }}>{item.text}</span>
          </div>
        ))}
      </div>
    </>
  )
}