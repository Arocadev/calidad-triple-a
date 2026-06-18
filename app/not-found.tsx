import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      background: '#111',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px',
    }}>
      <p style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '4px',
        color: '#FFD600',
        textTransform: 'uppercase',
        marginBottom: '16px',
      }}>Error 404</p>

      <h1 style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 900,
        fontSize: '120px',
        lineHeight: 0.85,
        color: '#fff',
        letterSpacing: '-4px',
        marginBottom: '24px',
      }}>
        UPS.
      </h1>

      <div style={{
        width: '60px',
        height: '4px',
        background: '#FFD600',
        borderRadius: '2px',
        marginBottom: '24px',
      }} />

      <p style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '18px',
        color: '#666',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '40px',
      }}>Esta página no existe</p>

      <Link href="/" style={{
        background: '#FFD600',
        color: '#111',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 900,
        fontSize: '16px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        padding: '12px 32px',
        borderRadius: '4px',
        textDecoration: 'none',
      }}>
        Volver al inicio
      </Link>
    </div>
  )
}