import Link from 'next/link'
import { IconShirt, IconSunglasses, IconHeadphones, IconRosette, IconTruckDelivery, IconBrandWhatsapp } from '@tabler/icons-react'

export default function Home() {
  return (
    <>
      <section style={{
        background: 'var(--negro)',
        padding: '40px 24px 0',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '15px',
          fontWeight: 700,
          letterSpacing: '4px',
          color: 'var(--amarillo)',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Ropa · Complementos · Electrónica
        </p>

        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: '100px',
          lineHeight: 0.88,
          color: '#fff',
          letterSpacing: '-2px',
        }}>
          CALIDAD<br />
          <span style={{ color: 'var(--amarillo)' }}>TRIPLE A</span>
        </h1>

        <div style={{
          width: '80px',
          height: '5px',
          background: 'var(--amarillo)',
          margin: '24px auto 18px',
          borderRadius: '2px',
        }} />

        <p style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '16px',
          color: '#666',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '32px',
        }}>
          Al mejor precio
        </p>

        <div style={{ display: 'flex', borderTop: '2px solid #444' }}>
          {[
            { label: 'Ropa', icon: <IconShirt size={28} stroke={1.5} color="#FFD600" /> },
            { label: 'Complementos', icon: <IconSunglasses size={28} stroke={1.5} color="#FFD600" /> },
            { label: 'Electrónica', icon: <IconHeadphones size={28} stroke={1.5} color="#FFD600" /> },
          ].map((cat, i) => (
            <Link href="/catalogo" key={i} style={{
              flex: 1,
              padding: '24px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRight: i < 2 ? '2px solid #444' : 'none',
              textDecoration: 'none',
            }}>
              {cat.icon}
              <span style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--amarillo)',
              }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div style={{
        background: 'var(--amarillo)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}>
        {[
          { text: 'Calidad AAA', icon: <IconRosette size={18} stroke={1.8} color="#111" /> },
          { text: 'Envío rápido', icon: <IconTruckDelivery size={18} stroke={1.8} color="#111" /> },
          { text: 'Pedido por WhatsApp', icon: <IconBrandWhatsapp size={18} stroke={1.8} color="#111" /> },
        ].map((item, i) => (
          <span key={i} style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--negro)',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}>
            {item.icon} {item.text}
          </span>
        ))}
      </div>
    </>
  )
}