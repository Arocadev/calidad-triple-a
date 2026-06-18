import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--negro)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid #222',
    }}>
      <span style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '12px',
        color: '#444',
        letterSpacing: '1px',
      }}>
        © {new Date().getFullYear()} Calidad Triple A
      </span>
      <Link href="/aviso-legal" style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '12px',
        color: '#444',
        letterSpacing: '1px',
      }}>
        Aviso legal
      </Link>
    </footer>
  )
}